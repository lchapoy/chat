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
  var friendId= req.query.friendId;
  Room.findByIdAndRemoveAsync(roomId)
    .then((data)=> {
      removeContRoom(data.members)
        .then(()=>{
          Room.schema.emit('friendDeleted',{friendId,roomId,name:req.session.name,userId:req.session._id});
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
function isRegistered(email,userId,cb,catchFn){
  return User.findOneAsync({email:email,request:{$ne:userId},pending:{$ne:userId},spam:{$ne:userId}}, {"name":1,"img":1,"status":1,"email":1})
    .then(cb)
    .catch(catchFn);
}
/**
 * Add Room
 */
function addContRoom(roomId,membersId) {
  return User.update({_id:{$in:membersId}},{$push:{rooms:roomId}},{multi: true});
}
/**
 * Friend Request
 */
function requestFriend(pendingId,requestId) {
  var promises=[];
  promises.push(User.update({_id:{$in:requestId}},{$push:{request:pendingId}},{multi: true}));
  promises.push(User.update({_id:{$in:pendingId}},{$push:{pending:requestId}},{multi: true}));
  return Promise.all(promises);
}
/**
 * add par room and erase pending and request pending
 */
function addParRoom(pendingId,requestId,roomId) {
  var promises=[];
  promises.push(User.update({_id:{$in:requestId}},{$pull:{request:pendingId}},{multi: true}));
  promises.push(User.update({_id:{$in:pendingId}},{$pull:{pending:requestId}},{multi: true}));
  promises.push(User.update({_id:{$in:[pendingId,requestId]}},{$push:{rooms:roomId}},{multi: true}));
  return Promise.all(promises);
}
/**
 * Remove Room
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
  isRegistered(email,userId,
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
            requestFriend(userId,friend._id)
              .then((response)=>{
                console.log(response);
                if(response.length==2){
                  Room.schema.emit("tellFriend",
                    { toId:friend._id,
                      from:req.session.user
                    });
                  res.status(201).json(friend);
                }else{
                  showErrorMessage(res,"Request could not be sent to "+email)();
                }
              }).catch(handleError(res));
            /*return Room.createAsync({
              members:[
                userId,
                friend._id
              ],
              kind:'par'
            }).then(contactRoom=>{
              requestFriend(contactRoom._id,friend._id,userId)
                .then((response)=>{
                  if(response.nModified==2){
                    Room.schema.emit("tellFriend",
                      { toId:friend._id,
                        from:{_id:contactRoom._id,
                          members:[req.session.user],
                          messages:[],
                          kind:'par'
                        }
                      });
                    res.status(201).json({_id:contactRoom._id,members:[friend],messages:[],kind:'par'});
                  }else{
                    showErrorMessage(res,"Request could not be sent to "+email)();
                  }
              }).catch(handleError(res));
            }).catch(handleError(res));*/
          }
          else{
            showErrorMessage(res,email+" is already your friend")();
          }
        });
      },()=>{
      User.findOneAsync({email:email})
      .then((data)=>{
          if(data.pending.indexOf(userId)!=-1)
            showErrorMessage(res,"You have a pending request from that user")();
          else if (data.request.indexOf(userId)!=-1)
            showErrorMessage(res,"User already have a pending request")();
          else
            showErrorMessage(res,data.email+" don't want to be your friend")();
        }).catch(()=>{
          showErrorMessage(res,"User doesn't exist")();
        })

    });
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
  group.img=String(req.body.img);
  var membersId = req.body.membersId;
  membersId.push(group.admin);
  group.members=membersId;
  group.kind = 'group';
    group.saveAsync()
      .spread((contactRoom)=>{
        addContRoom(contactRoom._id,membersId)
          .then((response)=>{
            if(response.nModified==membersId.length){
              group.populate({
                path:'members',
                model:User,
                select:"name img status email",
                match:{_id:{$ne:req.session._id}}
              },(err,data)=>{
                 // console.log("hi form inside");
                  if(err) res.status(401).json(data);
                  Room.schema.emit("tellGroup",data,req.session.name);
                  res.status(201).json(data);
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
      select:"messages members name kind img admin",
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
  if(req.body.scribble)
    message.scribble=req.body.scribble;
  //console.log("storeMessage "+message, userId)
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
  //console.log(userId,req.body)
}
/**
 * StoreMessage
 */
export function getMessage(req, res, next) {
  var roomId = req.params.id;
  Room.findOneAsync({_id:roomId})
    .then( room =>{
      return res.json(room.messages);
    })
    .catch(showErrorMessage(res,"Room does not exist"))


}
/**
 *  delete Friend From Group
 */
export function deleteFriendFromGroup(req, res, next) {
  //var user = new Room;
  var roomId= String(req.body.roomId);
  var friendId= String(req.body.friendId);
  var groupName= String(req.body.groupName);

  Room.updateAsync({_id:roomId},{$pull:{members:friendId}})
  .then((data)=>{
      User.findByIdAsync(friendId,{name:1})
      .then((doc)=>{
         // Room.schema.emit("leaveRoom",{id:friendId,roomId});
          Room.schema.emit("groupRemovedContact",{
            roomId,
            friendId,
            groupName,
            friendName:doc.name
          },req.session.name);

        })
      .catch(handleError(res));
      res.status(204).end();
    });
  User.updateAsync({_id:friendId},{$pull:{rooms:roomId}});

}
/**
 *  exit Group
 */
export function exitGroup(req, res, next) {
  //var user = new Room;
  var userId = req.session._id;
  var roomId= String(req.body.roomId);
  var groupName= String(req.body.groupName);
  //console.log(roomId,userId,user);
  Room.updateAsync({_id:roomId},{$pull:{members:userId}})
    .then((data)=>{
      Room.schema.emit("groupExitContact",{name:req.session.name,groupName:groupName,userId,roomId});
      res.status(204).end();
    }) .catch(handleError(res));
  User.updateAsync({_id:userId},{$pull:{rooms:roomId}});

}
/**
 *  delete Group
 */
export function deleteGroup(req, res, next) {

  var roomId= String(req.body.roomId);
  Room.findByIdAndRemoveAsync(roomId,{'members':1,'name':1,'_id':0})
  .then((data)=>{
     // console.log(data);
      removeContRoom(roomId,data.members)
      .then(()=>{
          Room.schema.emit("groupDeleted",{name:req.session.name,groupName:data.name,roomId});
          res.status(204).end();
      }).catch(handleError(res));
    }).catch(handleError(res));

}
/**
 *  add Friend To Group
 */
export function addFriendToGroup(req, res, next) {
  var roomId= req.body.roomId;
  //var friendName= String(req.body.friendName);
  //var friendId= String(req.body.friendId);
  var membersId= req.body.membersId;
  var groupName= String(req.body.groupName);
  var userId=req.session._id;

  Room.updateAsync({_id:roomId},{$addToSet:{members:{$each:membersId}}})
    .then((data)=>{
      addContRoom(roomId,membersId)
        .then((doc)=>{
          Room.schema.emit("groupAddedContact",{
            roomId,
            membersId,
            groupName
          },req.session.name);

        })
        .catch(handleError(res));
      res.status(204).end();
    });

}

/**
 *  delete Group
 */
export function acceptFriend(req, res, next) {
  var friendId= String(req.body.friendId);
  var userId =req.session._id;
  User.findByIdAsync(friendId,{"name":1,"img":1,"status":1,"email":1})
  .then((friend)=>{
      Room.createAsync({
        members:[friendId,userId],
        kind:'par'
      }).then(contactRoom=>{
        addParRoom(friendId,userId,contactRoom._id)
          .then((response)=>{
              Room.schema.emit("acceptFriend",
                { toId:friendId,
                  fromId:userId,
                  from:{_id:contactRoom._id,
                    members:[req.session.user],
                    messages:[],
                    kind:'par'
                  }
                });
              res.status(201).json({_id:contactRoom._id,members:[friend],messages:[],kind:'par'});

          }).catch(handleError(res));
      }).catch(handleError(res));
    }).catch(handleError(res));


}

export function rejectFriend(req, res, next) {
  var friendId= String(req.body.friendId);
  var userId =req.session._id;
  var promises=[]
  promises.push(User.findByIdAndUpdate(friendId,{$pull:{pending:userId}}));
  promises.push( User.findByIdAndUpdate(userId,{$pull:{request:friendId},$push:{spam:friendId}}));
  Promise.all(promises)
    .then((response)=>{
      res.status(201).json({});
    }).catch(handleError(res));
}

export function getRequestPendings(req, res, next) {
  var userId =  req.params.id;
  var promises=[];
  console.log("doce")
  promises.push(User.findOne({_id:userId}, {"request":1,"_id":0})
    .populate({
      path:"request",
      select:"email name  img",
      model:User
    }));
  promises.push(User.findOne({_id:userId}, {"pending":1,"_id":0})
    .populate({
      path:"pending",
      select:"email name  img",
      model:User
    }));
    Promise.all(promises)
      .then((data)=> {
        console.log(data[0],data[1].pending);
        res.json({pendings:data[1].pending,requests:data[0].request});
      })
}

