'use strict';

angular.module('chatYeoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('addGroup', {
        url: '/addGroup',
        templateUrl: 'app/chat/addGroup/addGroup.html',
        controller: 'AddGroupCtrl'
      });
  });
