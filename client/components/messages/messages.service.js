'use strict';


function MessageService() {
  var storage={};
  var Messages = {
    newMessage(fromUserId,messageInfo) {
      storage[fromUserId].push(messageInfo);
    },
    getMessages(fromUserId) {
      if(!storage[fromUserId]){
        storage[fromUserId]=[]
      }
      return storage[fromUserId]
    }
  };

  return Messages;
}

angular.module('chatYeoApp')
  .factory('Messages',MessageService);
