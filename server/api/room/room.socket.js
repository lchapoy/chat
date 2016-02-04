/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var RoomEvents = require('./room.events');
var User = require('../user/user.model');
var Room = require('./room.model');
// Model events to emit
var modelEvents = {
  //'save',
  // 'remove',
  'newFriend':newFriend,
  'deleteFriend':deleteFriend
};
var socketEvents = {
  'joinRooms':joinRooms,
  'addRoom':joinOneRoom,
  'delete':eventToRoom,
  'newMessage':eventToRoom
};

export function register(socket,id) {
  // Bind model events to socket events
  for (let e in modelEvents) {
    let callback = modelEvents[e];
    let listener = createListener('room:' + e, socket,callback);
    RoomEvents.on(e+':'+id._id, listener);
    socket.on('disconnect', removeListener(e+':'+id._id, listener));
  }
  //Listen to user socketEvent
  for (let e in socketEvents) {
    let callback = socketEvents[e];
    let listener = createListener(e, socket,callback,id);
    socket.on('room:'+e,listener);
    //socket.on('disconnect', removeListener(e+':'+id._id, listener));
  }
  //***************************************
  //Added by me
  socket.on('forceDisconnect',forceDisconnect(socket,id));
  //**************************************

}
function forceDisconnect(socket,id){
  return function(){
    User.findOne({_id:id._id},{rooms:1,_id:0})
      .populate({
        path:'rooms',
        model:Room,
        select:{'members':{$elemMatch:{$ne:id._id}},kind:"par"}
      }).exec((err,data)=>{
        data=data.rooms;
        for(var i=0;i<data.length;i++){
          socket.to(data[i].members[0])
          .emit(
            "userDisconnect",
            null,
            " "+socket.request.session.name+" is offline"
          );
        }
        socket.disconnect();
      });
  }
}

function joinRooms(socket,event,id){
  return function(){
    User.findOneAsync({_id:id},{'rooms':1,'_id':0})
     .then((data)=>{
        for(var i=0;i<data.rooms.length;i++){
          socket.join(data.rooms[i]);
        }
        socket.join(id._id);
      });
  };
}
function joinOneRoom(socket){
  return function(roomId){
    socket.join(roomId)
  };
}
function eventToRoom(socket,event){
  return function(doc,message){
    console.log(event);
    socket.to(doc.roomId).emit(event,doc,message);
  };
}

function newFriend(socket,event) {
  return function (doc) {
    var message=doc.from.members[0].name+" is your new friend";
    socket.broadcast.to(doc.toId).emit(event, doc.from,message);
    socket.join(doc.from._id);
  }
}

function deleteFriend(socket,event) {
  return function (doc) {
    var roomId=doc.roomId;
    var message=socket.request.session.name+" is no longer your friend";
    socket.log("s");
    //verify code form here
    //.broadcast.to(roomId)
    socket.emit(event,roomId,message);

  }
}

function createListener(event, socket,cb,id) {
  return cb(socket,event,id);
}

function removeListener(event, listener) {
  return function() {
    RoomEvents.removeListener(event, listener);
  };
}
