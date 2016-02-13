'use strict';


function MessageService(Comm) {
  var storage={};
  var initMessages=(fromRoomId)=>{
    if(!storage[fromRoomId]) {
      storage[fromRoomId] = [];
      Comm.getMessage({id: fromRoomId})
        .then(messages => {
          storage[fromRoomId].push(...messages);
        });
    }
  };

  var Messages = {
    newMessage(fromRoomId,messageInfo) {
      if(storage[fromRoomId])
      storage[fromRoomId].push(messageInfo);
    },
    getMessages(fromRoomId) {
      initMessages(fromRoomId);
      return storage[fromRoomId]
    }
  };

  return Messages;
}

angular.module('chatYeoApp')
  .factory('Messages',MessageService);
