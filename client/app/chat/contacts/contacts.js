'use strict';

angular.module('chatYeoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('contacts', {
        url: '/contacts',
        templateUrl: 'app/chat/contacts/contacts.html',
        controller: 'ContactsCtrl'
      });
  });
