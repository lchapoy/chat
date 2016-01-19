'use strict';

angular.module('chatYeoApp')
  .controller('InformationCtrl', function ($scope) {
    $scope.selection={};
    $scope.$on('selectionChange', function( event, user ){
      console.log(user);
      $scope.selection=user;
    });
  });
