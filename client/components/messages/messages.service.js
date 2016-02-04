'use strict';


function MessageService(Comm) {
  var storage={};
  var Messages = {
    newMessage(fromRoomId,messageInfo) {
      console.log(messageInfo);
      storage[fromRoomId].push(messageInfo);
    },
    getMessages(fromRoomId) {
      if(!storage[fromRoomId]){
        storage[fromRoomId]=[];
        Comm.getMessage({id:fromRoomId})
          .then( messages =>{
            storage[fromRoomId].push(...messages);
            console.log(messages);
          });
      }
      return storage[fromRoomId]
    }
  };

  return Messages;
}

angular.module('chatYeoApp')
  .factory('Messages',MessageService);
