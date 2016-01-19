'use strict';

angular.module('chatYeoApp')
  .controller('ContactsCtrl', function ($scope,User) {
    $scope.message = 'Hello';
    console.log('running')
    $scope.people=[];
    User.getFriends().$promise.then(contacts=>{

      $scope.people=contacts[0].contacts;
      console.log('running2',contacts);
    });
   /* $scope.people= [
      { name: 'Janet Perkins', img: '/assets/images/janetPerkings.jpg', newMessage: true },
      { name: 'Mary Johnson', img: '/assets/images/maryJohnson.jpg', newMessage: false },
      { name: 'Peter Carlsson', img: '/assets/images/peterCarlsson.jpg', newMessage: false }
    ];*/
    $scope.groups= [
      { name: 'Group1', img: '/assets/images/janetPerkings.jpg', newMessage: true },
      { name: 'Group2', img: '/assets/images/maryJohnson.jpg', newMessage: false },
      { name: 'Group3', img: '/assets/images/peterCarlsson.jpg', newMessage: false }
    ];

    $scope.selectUser=function(user){
      $scope.$emit('pushChanges', sendNewChanges(user));
    }

    $scope.$on('newFriend', function(event, user ){
      console.log(user);
      $scope.people.push(user);
    });



    function sendNewChanges(user){ // for some event.
      return { name: 'selectionChange', data: user };
    }

  });
