'use strict';

angular.module('chatYeoApp')
  .directive('ctxDraw', function () {
    return {
      scope: {
        ctxDraw: '='
      },
      restrict: 'A',
      link: function (scope, element, attrs) {
         var canvas=element[0];
         var context = canvas.getContext('2d');
         var img=scope.ctxDraw;
         context.drawImage(img, 0, 0);
      }
    };
  });
