'use strict';

angular.module('chatYeoApp')
  .controller('ContactsCtrl', function ($scope,Chat) {
    $scope.message = 'Hello';

    $scope.rooms=Chat.getRooms();
    $scope.groups=Chat.getGroups();

    $scope.selectUser=function(room,index){
      Chat.changeSelection(room,index);
    };

  });
