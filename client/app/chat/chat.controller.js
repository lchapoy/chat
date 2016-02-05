'use strict';

angular.module('chatYeoApp')
  .controller('ChatCtrl', function ($scope,$mdSidenav,User,Auth,socket,Comm) {
    $scope.$on('pushChanges', function( event, message ){
      if(message.data.kind=="par")
        $scope.rooms[message.index].newMessage=false;
      else
        $scope.groups[message.index].newMessage=false;
      console.log('changed');
      $scope.$broadcast( message.name, message.data );
    });

    //Very important will get a new socket
    socket.socket();
    $scope.rooms=[];
    $scope.groups=[];
    $scope.currentUser=Auth.getCurrentUser();
    $scope.toggleAddContact=buildToggler('addContact');
    $scope.toggleAddGroup=buildToggler('addGroup');
    $scope.toggleContacts=buildToggler('contacts');
    $scope.toggleInfo=buildToggler('information');

    Comm.getRooms({id:$scope.currentUser._id,kind:'par'})
      .then(contacts=>{
         $scope.rooms=contacts[0].rooms;
      });
    Comm.getRooms({id:$scope.currentUser._id,kind:'group'})
      .then(contacts=>{
        $scope.groups=contacts[0].rooms;
      });

    $scope.$on('newFriend', function(event, user ){
      $scope.rooms.push(user);
      socket.addRoom(user._id);
      $scope.toggleAddContact();
    });
    $scope.$on('deleteFriend',function(event,deleteInfo){

      Comm.deleteRoom(deleteInfo).then(()=>{
        var index=$scope.rooms.indexOf(deleteInfo._id);
        $scope.rooms.splice(index,1);
        $scope.toggleInfo();
      });
    });
    $scope.$on('newMessage',function(event,room){
      var index=null;
      var lookArr;
      console.log(room.kind)
      if(room.kind=="par")
        lookArr=$scope.rooms;
      else
        lookArr=$scope.groups;

      angular.forEach(lookArr,(value,ind)=> {
        if (room.id === value._id) {
          index = ind;
          return true
        }
      });
      console.log(index,lookArr[index]);
      lookArr[index].newMessage=true;
    });
    /*socket.socket().on('userDisconnect',function(doc){
      showSimpleToast(doc.message);
    });*/
    /*socket.socket().on('room:newFriend',function(doc){
      showSimpleToast(doc.members[0].name+' is your new friend');
      socket.addRoom(doc._id);
      $scope.rooms.push(doc)
    });*/
    socket.listener('room:newFriend',(doc)=>{
      socket.addRoom(doc._id);
      $scope.rooms.push(doc);
    });
    socket.listener('room:newGroup',(doc)=>{
      socket.addRoom(doc._id);
      $scope.groups.push(doc);
    });

    socket.listener('room:deleteFriend',(roomId)=>{
      var index=$scope.rooms.indexOf(roomId);
      $scope.rooms.splice(index,1);
    });
    socket.listener('room:changeStatus',(roomId)=>{
     var index;
      angular.forEach($scope.rooms,(val,ind)=>{
       if(val._id==roomId){
         index=ind;
         return true
       }
     });
      $scope.rooms[index].members[0].status='Online';
      console.log($scope.rooms[index])
    });
    socket.listener('userDisconnect',(roomId)=>{
      var index;
      angular.forEach($scope.rooms,(val,ind)=>{
        if(val._id==roomId){
          index=ind;
          return true
        }
      });
      $scope.rooms[index].members[0].status='Offline';
    });

    $scope.$on('newGroup', function(event, group){
      console.log(group)
      $scope.groups.push(group.data);
    });

    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            console.log("toggle " + navID + " is done");
          });
      }
    }

    //Get actual socket or create one if there is no socket//
    console.log(socket.socket());
    //Subscribe socket to all user rooms
    socket.joinRooms();
    //$scope.
      /*function isShow(sidebar){
        return function(){

          console.log(sidebar+" " +$mdSidenav(sidebar).isOpen())
          $mdSidenav(sidebar).isOpen();
        }
      };*/
    console.log("chat running")
  });
