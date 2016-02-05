'use strict';

angular.module('chatYeoApp')
  .controller('ContactsCtrl', function ($scope,User,Comm) {
    $scope.message = 'Hello';

    console.log('running')
    //$scope.rooms=[];
    //$scope.groups=[];
    Comm.getRooms({id:$scope.currentUser._id,kind:'par'})
      .then(contacts=>{
       // $scope.rooms=contacts[0].rooms;
       // $scope.$emit('pushChanges', sendAllUsers($scope.rooms));
        console.log('running2',contacts[0].rooms);
        $scope.$on('allFriends',{data:contacts[0].rooms});
      });
    Comm.getRooms({id:$scope.currentUser._id,kind:'group'})
      .then(contacts=>{
        //$scope.groups=contacts[0].rooms;
       // $scope.$emit('pushChanges', sendAllUsers($scope.rooms));
        console.log('running2',contacts[0].rooms);
      });
  /*  $scope.groups= [
      { name: 'Group1', img: '/assets/images/janetPerkings.jpg', newMessage: true },
      { name: 'Group2', img: '/assets/images/maryJohnson.jpg', newMessage: false },
      { name: 'Group3', img: '/assets/images/peterCarlsson.jpg', newMessage: false }
    ];*/

    $scope.selectUser=function(user,index){
      $scope.$emit('pushChanges', sendNewChanges(user,index));
    };

   /* $scope.$on('newFriend', function(event, user ){
      console.log(user);
      $scope.rooms.push(user);
    });
    $scope.$on('newGroup', function(event, group){
      $scope.groups.push(group);
    });
*/

   // function sendAllUsers(users){ // for some event.
    //  return { name: 'allFriends', data: users };
   // }
    function sendNewChanges(user,index){ // for some event.
      return { name: 'selectionChange', data: user, index:index};
    }

  });
