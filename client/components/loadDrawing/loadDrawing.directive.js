'use strict';

angular.module('chatYeoApp')
  .directive('loadDrawing', function ($mdDialog) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        var imageObj = element[0];
        imageObj.onclick = function () {
          scope.showCanvas();
        };

        scope.showCanvas = function () {
          $mdDialog.show({
            clickOutsideToClose: true,
            parent: angular.element(document.body),
            templateUrl: 'components/loadDrawing/loadDrawing.html',
            controller: 'LoadDrawingCtrl',
            locals:{imageObj}
          });
        }
      }
    };
  });
