'use strict';

angular.module('chatYeoApp')
  .factory('EventNotify', function($rootScope) {
    return {
      subscribe: function(scope, callback) {
        var handler = $rootScope.$on('event-notify', callback);
        scope.$on('$destroy', handler);
      },
      notify: function() {
        $rootScope.$emit('event-notify');
      }
    };
  });
