'use strict';

angular.module('chatYeoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('information', {
        url: '/information',
        templateUrl: 'app/chat/information/information.html',
        controller: 'InformationCtrl'
      });
  });
