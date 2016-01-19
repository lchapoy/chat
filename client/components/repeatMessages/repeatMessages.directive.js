'use strict';

angular.module('chatYeoApp')
  .directive('repeatMessages', function () {
    return {
      templateUrl: 'components/repeatMessages/repeatMessages.html',
      restrict: 'EA',
      scope:{
        messages:'=messages'
      },
      link: function (scope, element, attrs) {
        console.log(scope.messages);
      }
    };
  });
