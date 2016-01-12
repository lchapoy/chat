'use strict';

angular.module('chatYeoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('messages', {
        url: '/messages',
        templateUrl: 'app/chat/messages/messages.html',
        controller: 'MessagesCtrl'
      });
  });
