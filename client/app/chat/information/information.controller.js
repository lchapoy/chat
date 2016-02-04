'use strict';

angular.module('chatYeoApp')
  .controller('InformationCtrl', function ($scope) {
    $scope.selection={};
    $scope.roomId="NoID";
    $scope.$on('selectionChange', function( event, user ){
      console.log(user);
      $scope.roomId = user._id;
      if(user.kind=="par") {
        $scope.selection = user.members[0];
      }else{
        $scope.selection= user;
      }
    });
    $scope.deleteFriend=()=>{
      $scope.$emit('deleteFriend',{id:$scope.roomId,userId:$scope.selection._id})
      $scope.selection=$scope.currentUser;
    }
  });
