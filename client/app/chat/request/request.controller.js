'use strict';



class RequestController {
  //start-non-standard
  errors = {};
  answer = {};
  //end-non-standard

  constructor(Chat,Comm) {

    this.Comm=Comm;
    this.Chat = Chat;
    this.requests=Chat.getRequests();

  }

  acceptFriend = function (friendId) {
    this.Comm.acceptFriend({friendId}).then((room)=> {
      this.Chat.newFriend(room);
    }).catch((err)=> {
      this.errors.other = err.data.message;
    });
  };
  rejectFriend = function (friendId) {
    this.Comm.rejectFriend({friendId}).then(()=> {
      this.Chat.rejectRequest(friendId);
    }).catch((err)=> {
      this.errors.other = err.data.message;
    });
  }


}


angular.module('chatYeoApp')
  .controller('RequestCtrl' ,RequestController);
