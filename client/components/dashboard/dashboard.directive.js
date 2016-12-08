'use strict';

angular.module('chatYeoApp')
  .directive('dashboard', function (sideNavToggler) {
    return {
      templateUrl: 'components/dashboard/dashboard.html',
      restrict: 'EA',
      scope:{

      },
      replace:true,
      link: function (scope, element, attrs) {
        scope.openContact = sideNavToggler.triggerToggle('contacts');
      }
    };
  });
