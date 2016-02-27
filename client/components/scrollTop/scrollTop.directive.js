'use strict';

angular.module('chatYeoApp')
  .directive('scrollTop', function ($timeout) {
    return {

      restrict: 'A',
      link: function (scope, element, attrs) {
        element.bind('scroll load', ()=>{
          var rest= element[0].scrollHeight-element[0].scrollTop;
          if( element[0].scrollTop<100) {
            scope.scrollFn()
          }
        });
      }
    };
  });
