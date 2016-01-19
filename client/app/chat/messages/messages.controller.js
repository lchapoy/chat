'use strict';

angular.module('chatYeoApp')
  .controller('MessagesCtrl', function ($scope,Messages) {
    $scope.selection = {name:"Choose Friend To start Chatting"};
    $scope.messages=[];
    $scope.sendText="selection"
    $scope.$on('selectionChange', function( event, user ){
      console.log(user);
      $scope.selection=user;
      $scope.messages=Messages.getMessages($scope.selection.name);
    });

    $scope.addMessage = ()=>{
      Messages.newMessage($scope.selection.name,{text:$scope.sendText,origin:'me'})
      Messages.newMessage($scope.selection.name,{text:"Answer",origin:'from'})
      $scope.sendText=''
      console.log(Messages.getMessages($scope.selection.name));
    }
  });
