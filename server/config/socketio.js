/**
 * Socket.io configuration
 */
'use strict';

import config from './environment';
import RoomEvents from '../api/room/room.events';

//Model Events
var modelEvents = {
  'newRequest':newRequest,
  'newGroup':newGroup,
  'deleteFriend':deleteFriend,
  'tellFriendRemoved':tellFriendRemoved,
  'tellFriendAccepted':tellFriendAccepted,
  //'tellFriendRejected':tellFriendRejected,
  'tellFriendExit':tellFriendExit,
  'tellGroupDeleted':tellGroupDeleted,
  'tellGroupAddedFriend':tellGroupAddedFriend
};

// When the user disconnects.. perform this
function onDisconnect(socket) {
}

// When the user connects.. perform this
function onConnect(socket) {
  // When the client emits 'info', this listens and executes
  socket.on('info', data => {
    socket.log(JSON.stringify(data, null, 2));
  });
  var id=socket.decoded_token;
  // Insert sockets below
  require('../api/room/room.socket').register(socket,id);
  require('../api/thing/thing.socket').register(socket);

}
/**
 * Socket leave room
 *  doc{
 *     id: socket id being removed
 *     roomId: room being disconnected
 *  }
*/
function leaveRoom (socket,userId,roomId){
  var roomSockets= socket.nsps['/'].adapter.rooms[userId];

  if(roomSockets)
    for (var socketId in roomSockets.sockets) {
      var _socket = socket.sockets.connected[socketId];
      _socket.leave(roomId);
    }
}

/**
 * Socket join room
 *  doc{
 *     id: socket id being removed
 *     roomId: room being disconnected
 *  }
 */
function joinRoom(socket,userId,roomId){
  var roomSockets= socket.nsps['/'].adapter.rooms[userId];

  if(roomSockets)
    for (var socketId in roomSockets.sockets) {
      var _socket = socket.sockets.connected[socketId];
      _socket.join(roomId);
    }
}

function newRequest(socket,event) {
  return function (doc) {
    //joinRoom(socket,doc.toId,doc.from._id);
    var message=" You have a new friend request from "+doc.from.email;
    socket.to(doc.toId).emit(event, doc.from,message);
    //socket.join(doc.from._id);
  }
}

//Group behavior events
function tellFriendRemoved(socket,event) {
  return function (doc,info) {
    //Socket's friend Leave Room
    leaveRoom(socket,doc.friendId,doc.roomId);
    //Message to friend
    var message=info+" kicked you out of "+doc.groupName+" conversation";
    socket.to(doc.friendId).emit(event, {roomId:doc.roomId,friendId:doc.friendId},message);
    //Message to all other members
    message=doc.friendName+" was kicked out of "+doc.groupName+" conversation";
    socket.to(doc.roomId).emit(event, {roomId:doc.roomId,friendId:doc.friendId},message);
    //socket.join(doc.from._id);
  }
}
//Tell a group was deleted
function tellGroupDeleted(socket,event) {
  return function (doc,info) {

    //Message to friend
    var message=doc.groupName+" was deleted by "+doc.name;
    socket.to(doc.roomId).emit(event,null,message);
    //socket.join(doc.from._id);
    //Socket's Leave Room
    leaveRoom(socket,doc.roomId,doc.roomId);
  }
}
//Tell a group a friend was added
function tellGroupAddedFriend(socket,event) {
  return function (doc,info) {
    //Message to the group members
    message=" Some people were added to "+doc.groupName+" conversation";
    socket.to(doc.roomId).emit(event,null,message);
    //Message to friend
    var message=info+" added you to "+doc.groupName+" conversation";
    Array.forEach(doc.membersId,(friendId)=>{
      socket.to(friendId).emit(event,null,message);
      joinRoom(socket,friendId,doc.roomId);
    });


    //socket.join(doc.from._id);
    //Socket's Leave Room

  }
}
//Start Changing Here
function tellFriendExit(socket,event) {
  return function (doc) {
    //Leave Room
    leaveRoom(socket,doc.userId,doc.roomId);
    //Message to be send
    var message=doc.name+" leave "+doc.groupName+" conversation";
    //Emit event to all other members
    socket.to(doc.roomId).emit(event, {roomId:doc.roomId,friendId:doc.friendId},message);
  }
}
//Group behavior events
function tellFriendAccepted(socket,event) {
  return function (doc) {
    //Socket's friend join to Room
    joinRoom(socket,doc.toId,doc.from._id);
    //me join to Room
    joinRoom(socket,doc.fromId,doc.from._id);
    //Message to friend
    var message=doc.from.members[0].name+" accept your friend request ";
    socket.to(doc.toId).emit(event,doc.from,message);
  }
}


function newGroup(socket,event) {
  return function (group,info) {
    var message=info+" added you to "+group.name+" group";
    var members=group.members;
    for(var i=0;i<members.length;i++) {
      joinRoom(socket,members[i]._id,group._id);
      if(!group.admin.equals(members[i]._id))
      socket.to(members[i]._id).emit(event, group, message);
  }
    //socket.join(doc.from._id);
  }
}

function deleteFriend(socket,event) {
  return function (doc) {
    var friendId=doc.friendId;
    var message=doc.name+" is no longer your friend";
    leaveRoom(socket,friendId,doc.roomId);
    leaveRoom(socket,doc.userId,doc.roomId);
    socket.to(friendId).emit(event,doc.roomId,message);

  }
}


export default function(socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
   socketio.use(require('socketio-jwt').authorize({
     secret: config.secrets.session,
     handshake: true
  }));

  socketio.use(function(socket, next) {
    config.session(socket.request, socket.request.res, next);
  });

  //Subscribe socket.io events
  for (let e in modelEvents) {
    let callback = modelEvents[e];
    RoomEvents.on(e, callback(socketio,'room:'+e));
  }

  socketio.on('connection', function(socket) {
    socket.address = socket.request.connection.remoteAddress +
      ':' + socket.request.connection.remotePort;

    socket.connectedAt = new Date();

    socket.log = function(...data) {
      console.log(`SocketIO ${socket.nsp.name} [${socket.address}]`, ...data);
    };


    // Call onDisconnect.
    socket.on('disconnect', () => {
      onDisconnect(socket);
      socket.log('DISCONNECTED');
    });

    // Call onConnect.
    onConnect(socket);
    socket.log('CONNECTED');
  });
}
