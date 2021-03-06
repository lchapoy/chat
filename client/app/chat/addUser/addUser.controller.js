'use strict';



class AddUserCtrl {
  //start-non-standard
  errors = {};
  answer = {};
  //end-non-standard

  constructor(Comm,Chat) {
    this.Comm=Comm;
    this.Chat = Chat;
    this.requests=Chat.getRequests();
    this.pendings=Chat.getPendings();

  }

  newContact = function (email) {
    this.Comm.createRoom({email:email}).then((user)=> {
      this.errors.other = '';
      this.answer.other = 'request was sent to ' + email;
      this.Chat.newRequest(user);
    }).catch((err)=> {
      this.errors.other = err.data.message;
    });
  };
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
  .controller('AddUserCtrl' ,AddUserCtrl);
