'use strict';



class PendingController {
  //start-non-standard
  errors = {};
  answer = {};
  //end-non-standard

  constructor(Comm,Chat) {
    this.Comm=Comm;
    this.Chat = Chat;
    this.pendings=Chat.getPendings();

  }


}


angular.module('chatYeoApp')
  .controller('PendingCtrl' ,PendingController);
