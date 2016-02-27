/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var RoomEvents = require('./room.events');
import User from '../user/user.model';
import Room from './room.model';

var socketEvents = {
  'delete':eventToRoom,
  'removeRoom':removeRoomListener,
  'newMessage':eventToRoom
};

export function register(socket,id) {
  //Listen to user socketEvent
  for (let e in socketEvents) {
    let callback = socketEvents[e];
    let listener = createListener(e, socket,callback,id);
    socket.on('room:'+e,listener);
  }
  //***************************************
  //Added by me
  socket.on('forceDisconnect',forceDisconnect(socket,id));
  //***************************************

}
function forceDisconnect(socket,id){
  return function(){
    User.findOne({_id:id._id},{rooms:1,status:1})
      .populate({
        path:'rooms',
        model:Room,
        select:{'members':{$elemMatch:{$ne:id._id}},kind:"par"}
      }).exec((err,data)=>{
        data.status='Offline';
        data.saveAsync();
        data=data.rooms;
        for(var i=0;i<data.length;i++){
          socket.log(data[i].members[0].name);
          socket.to(data[i].members[0])
          .emit(
            "userDisconnect",
            data[i]._id,
            " "+socket.request.session.name+" is offline"
          );
        }
        socket.disconnect();
      });
  }
}

function removeRoomListener(socket){
  return function(roomId){
    socket.leave(roomId)
  };
}

function eventToRoom(socket,event){
  return function(doc,message){
    //console.log(event);
    socket.to(doc.roomId).emit(event,doc,message);
  };
}


function createListener(event, socket,cb,id) {
  return cb(socket,event,id);
}

function removeListener(event, listener) {
  return function() {
    RoomEvents.removeListener(event, listener);
  };
}
