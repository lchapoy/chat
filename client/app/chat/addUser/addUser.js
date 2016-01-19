'use strict';

angular.module('chatYeoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('addUser', {
        url: '/addUser',
        templateUrl: 'app/chat/addUser/addUser.html',
        controller: 'AddUserCtrl'
      });
  });
