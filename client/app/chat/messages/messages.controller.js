'use strict';

angular.module('chatYeoApp')
  .controller('MessagesCtrl', function ($scope,Messages,Comm,socket) {
    $scope.selection = {name:"Choose Friend To start Chatting"};
    $scope.room="";
    $scope.messages=[];
    $scope.sendText="";
    $scope.$on('selectionChange', function( event, user ){
      console.log(user);
      $scope.room=user._id;
      if(user.kind=="par") {
        $scope.selection = user.members[0];
      }else{
        $scope.selection=user;
      }
      $scope.messages=Messages.getMessages($scope.room);
    });
    socket.socket().on('newMessage',function(doc){
      Messages.newMessage(doc.roomId,doc.message);
    });
    $scope.addMessage = ()=>{
      socket.messageToRoom($scope.room,{name:$scope.currentUser.name,text:$scope.sendText,origin:$scope.currentUser._id});
      Messages.newMessage($scope.room,{name:$scope.currentUser.name,text:$scope.sendText,origin:$scope.currentUser._id});
      Comm.storeMessage({id:$scope.currentUser._id},{name:$scope.currentUser.name,text:$scope.sendText,roomId:$scope.room})
      $scope.sendText='';
    }
  });
