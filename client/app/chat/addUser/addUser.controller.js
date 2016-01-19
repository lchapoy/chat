'use strict';



class AddUserCtrl {
  //start-non-standard
  errors = {};
  answer = {};
  //end-non-standard

  constructor(User, $scope) {
    this.User = User;
    this.scope = $scope;
    this.currentUser = User.get();
  }

  message = 'Hello';
  /*people = [
    {name: 'Janet Perkins', img: '/assets/images/janetPerkings.jpg', newMessage: true},
    {name: 'Marty Johnson', img: '/assets/images/maryJohnson.jpg', newMessage: false},
    {name: 'Peter Carlsson', img: '/assets/images/peterCarlsson.jpg', newMessage: false}
  ];*/

  newContact = function (email) {
    this.User.addFriend({id: this.currentUser._id}, {email: email}).$promise.then((res)=> {
      this.errors.other = '';
      this.answer.other = 'request was send to ' + email;
      console.log(res);
      this.scope.$emit('pushChanges', sendNewChanges(res));
    }).catch((err)=> {
      this.errors.other = err.data.message;
      console.log(err)
    });
    function sendNewChanges(user) { // for some event.
      return {name: 'newFriend', data: user};
    }
  }
}


angular.module('chatYeoApp')
  .controller('AddUserCtrl' ,AddUserCtrl)/*, function ($scope,User) {
    var errors={};

    var currentUser=User.get();
    $scope.newContact=function(email){
      User.addFriend({id: currentUser._id}, {email: email}).$promise.then((res)=>{

      }).catch((err)=>{
        this.errors.other = err.message;
        console.log(err)
      })
    };*/
   /* currentUser.$promise.then(() => {
      console.log(currentUser._id);
      //User.addFriend({id: currentUser._id}, {email: 'test@example.com'});
      $scope.newContact=
    });*/
  //});
