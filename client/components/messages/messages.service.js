'use strict';


function MessageService(Comm) {
  var storage={};
  var messageXpage=20;
  var initMessages=(fromRoomId)=>{
    if(!storage[fromRoomId]) {
      storage[fromRoomId]={};
      storage[fromRoomId].messages = [];
      storage[fromRoomId].page=0;
      storage[fromRoomId].end=false;
      Comm.getMessage({id: fromRoomId,page:storage[fromRoomId].page,messageXpage})
        .then(messages => {
          messages.reverse();
          if(messages.length<messageXpage)
            storage[fromRoomId].end=true;
          storage[fromRoomId].messages.push(...messages);
        });
    }
  };

  var Messages = {
    newMessage(fromRoomId,messageInfo) {
      if(storage[fromRoomId])
      storage[fromRoomId].messages.push(messageInfo);
    },
    getMessages(fromRoomId) {
      initMessages(fromRoomId);
      return storage[fromRoomId].messages
    },
    getNextPackage(fromRoomId){
      if(!storage[fromRoomId].end){
        storage[fromRoomId].page++;
        Comm.getMessage({id: fromRoomId,page:storage[fromRoomId].page,messageXpage})
          .then(messages => {
            if(messages.length<messageXpage)
              storage[fromRoomId].end=true;
            messages.reverse();
            storage[fromRoomId].messages.unshift(...messages);
          });
        return true
      }
      return false;
    }

  };

  return Messages;
}

angular.module('chatYeoApp')
  .factory('Messages',MessageService);
