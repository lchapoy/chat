'use strict';

angular.module('chatYeoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('chat', {
        url: '/chat',
        views: {
          '': {
            templateUrl: 'app/chat/chat.html',
            controller: 'ChatCtrl'
          },
          'contacts@chat': {
            templateUrl: 'app/chat/contacts/contacts.html',
            controller:'ContactsCtrl'
          },
          'messages@chat': {
            templateUrl: 'app/chat/messages/messages.html',
            controller:'MessagesCtrl'
          },
          'information@chat': {
            templateUrl: 'app/chat/information/information.html',
            controller:'infoCtrl'
          }
        }

      });
  });
