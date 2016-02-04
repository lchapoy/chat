'use strict';

angular.module('chatYeoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('chat', {
        url: '/chat',
        authenticate: true,
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
            controller:'InformationCtrl'
          },
          'addContact@chat': {
            templateUrl: 'app/chat/addUser/addUser.html',
            controller:'AddUserCtrl',
            controllerAs:'ac'
          },
          'addGroup@chat': {
            templateUrl: 'app/chat/addGroup/addGroup.html',
            controller:'AddGroupCtrl',
            controllerAs:'group'
          }
        }

      });
  });
