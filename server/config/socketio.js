/**
 * Socket.io configuration
 */
'use strict';

import config from './environment';
import RoomEvents from '../api/room/room.events';

//Model Events
var modelEvents = {
  'newFriend':newFriend,
  'newGroup':newGroup,
  'deleteFriend':deleteFriend
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

function newFriend(socket,event) {
  return function (doc) {

    var message=doc.from.members[0].name+" is your new friend";
    socket.to(doc.toId).emit(event, doc.from,message);
    //socket.join(doc.from._id);
  }
}

function newGroup(socket,event) {
  return function (group,info) {
    var message=info+" added you to "+group.name+" group";
    var members=group.members;
    for(var i=0;i<members.length;i++) {
      console.log(group.admin!=members[i]._id);
      console.log(group.admin,members[i]._id);
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
