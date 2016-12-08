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
            controller:'ContactsCtrl',
            controllerAs:'CCtrl'
          },
          'messages@chat': {
            templateUrl: 'app/chat/messages/messages.html',
            controller:'MessagesCtrl',
            controllerAs:'MessCtrl'
          },
          'information@chat': {
            templateUrl: 'app/chat/information/information.html',
            controller:'InformationCtrl',
            controllerAs:'ICtrl'
          },
          'addContact@chat': {
            templateUrl: 'app/chat/addUser/addUser.html',
            controller:'AddUserCtrl',
            controllerAs:'ac'
          },
          'addGroup@chat': {
            templateUrl: 'app/chat/addGroup/addGroup.html',
            controller:'AddGroupCtrl',
            controllerAs:'GCtrl'
          },
          'pending@chat': {
            templateUrl: 'app/chat/pendings/pendings.html',
            controller:'PendingCtrl',
            controllerAs:'vm'
          },
          'request@chat': {
            templateUrl: 'app/chat/request/request.html',
            controller:'RequestCtrl',
            controllerAs:'vm'
          }
        }

      });
  });
