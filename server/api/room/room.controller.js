/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/rooms              ->  index
 * POST    /api/rooms              ->  create
 * GET     /api/rooms/:id          ->  show
 * PUT     /api/rooms/:id          ->  update
 * DELETE  /api/rooms/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Room from './room.model';
import User from '../user/user.model';
/*
function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}
*/
function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}
/*
function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}
*/
// Gets a list of Rooms
export function index(req, res) {
  Room.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
}
/*
// Gets a single Room from the DB
export function show(req, res) {
  Room.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Creates a new Room in the DB
export function create(req, res) {
  Room.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Room in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Room.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a Room from the DB
export function destroy(req, res) {
  Room.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
*/
'use strict';

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

function showErrorMessage(res,message,statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json({message:message});
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function respondWith(res, statusCode) {
  statusCode = statusCode || 200;
  return function() {
    res.status(statusCode).end();
  };
}

/**
 * Deletes a Room
 * restriction: 'admin'
 */
export function destroy(req, res) {
 var roomId= req.params.id;
  var userId= req.query.userId;
  Room.findByIdAndRemoveAsync(roomId)
    .then((data)=> {
      removeContRoom(data.members)
        .then(()=>{
          Room.schema.emit('friendDeleted',{_id:userId,roomId:roomId});
          res.status(204).end();
      })
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */

export function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findByIdAsync(userId)
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.saveAsync()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}
/**
 *  Verify if User is already Registered
 * @param email
 * @param cb
 * @param catchFn
 * @returns {*}
 */
function isRegistered(email,cb,catchFn){
  return User.findOneAsync({email:email}, {"name":1,"img":1,"status":1,"email":1})
    .then(cb)
    .catch(catchFn);
}
/**
 * Add Room
 */
export function addContRoom(roomId,membersId) {
  return User.update({_id:{$in:membersId}},{$push:{rooms:roomId}},{multi: true});
}
/**
 * Add Room
 */
function removeContRoom(roomId,membersId) {
  return User.update({_id:{$in:membersId}},{$pull:{rooms:roomId}},{multi: true});
}

/**
 * Add Friend
 */
export function createRoom(req, res, next) {

  var userId = req.session._id;
  var email = String(req.body.email);
  isRegistered(email,
      user=>{
        var friend=user;
        if(friend._id.equals(userId)){
          return showErrorMessage(res,"You are not suppose to be your own friend")();
        }
        Room.findOne({
          $or:[{ members:[
              userId,
              friend._id
            ]},{members:[
              friend._id,
              userId
            ]}
          ]
        })
        .then( room =>{
          if(!room){
            return Room.createAsync({
              members:[
                userId,
                friend._id
              ],
              kind:'par'
            }).then(contactRoom=>{
              addContRoom(contactRoom._id,[friend._id,userId])
                .then((response)=>{
                  if(response.nModified==2){
                    console.log(req.user);
                    Room.schema.emit("tellFriend",
                      {_id:userId,
                        toId:friend._id,
                        from:{_id:contactRoom._id,
                          members:[req.session.user],
                          messages:[],
                          kind:'par'
                        }
                      });
                    res.status(201).json({_id:contactRoom._id,members:[friend],messages:[],kind:'par'});
                  }else{
                    showErrorMessage(res,email+" could not be added to the room")();
                  }
              }).catch(handleError(res));
            }).catch(handleError(res));
          }
          else{
            showErrorMessage(res,email+" is already your friend")();
          }
        });
      },showErrorMessage(res,"User doesn't exist"));
}
function getMembersId(admin,members){
  var arrId=[];
  arrId.push(admin);
  arrForEach(members,(user)=>{
    arrId.push(user._id)
  });
  return arrId;
}
/**
 * Add Group
 */
export function createGroup(req, res, next) {
  var group = new Room;
  group.admin = req.session._id;
  group.name = String(req.body.groupName);
  var membersId = req.body.membersId;
  membersId.push(group.admin);
  group.members=membersId;
  group.kind = 'group'
    group.saveAsync()
      .spread((contactRoom)=>{
        addContRoom(contactRoom._id,membersId)
          .then((response)=>{
            if(response.nModified==membersId.length){
              group.populate(
                'members',
                (err,user)=>{
                  if(err) res.status(401).json(user);
                  res.status(201).json(user);
                });
            }else{
              showErrorMessage(res,email+" could not be added to the room")();
            }
          }).catch(handleError(res));
      }).catch(handleError(res));
}
/**
 * Get All Friend Info
 */
export function getRooms(req, res, next) {
  var userId =  req.params.id;
  var kind= req.query.kind;
  User.find({_id:userId}, {"rooms":1,"_id":0})
    .populate({
      path:"rooms",
      select:"messages members name kind",
      match:{kind:kind},
      populate:{
        path:"members",
        model:User,
        select:"name img status email",
        match:{_id:{$ne:userId}}
}
    })
    .exec(function (err, res1) {
      if(err) res.status(401).json(res1);
      res.json(res1);
    })
}
/**
 * StoreMessage
 */
export function storeMessage(req, res, next) {
  var userId = req.params.id;
  var roomId= String(req.body.roomId);
  var message={
    name:req.body.name,
    text:req.body.text,
    origin:userId
  };
  console.log("storeMessage "+message, userId)
  Room.findOneAsync({_id:roomId})
    .then( room =>{
      room.messages.push(message);
      return room.saveAsync()
        .then(() => {
          res.status(204).end();
        })
        .catch(validationError(res));
    })
    .catch(showErrorMessage(res,"Room does not exist"))
  console.log(userId,req.body)
}
/**
 * StoreMessage
 */
export function getMessage(req, res, next) {
  var roomId = req.params.id;
  Room.findOneAsync({_id:roomId})
    .then( room =>{
      console.log(room.messages);
      return res.json(room.messages);
    })
    .catch(showErrorMessage(res,"Room does not exist"))


}

