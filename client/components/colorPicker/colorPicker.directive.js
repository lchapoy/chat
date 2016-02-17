'use strict';

angular.module('chatYeoApp')
  .directive('colorPicker', function () {
    return {
      templateUrl: 'components/colorPicker/colorPicker.html',
      restrict: 'E',
      scope:{
        color: '=',
        options: '=',
        onColorChanged: '&'
      },
      replace:true,
      link: function (scope, element, attrs) {
        scope.clickVar=false;
        scope.changeColor = function(option){
          scope.clickVar=false;
          if(scope.color !=option){
            var old= scope.color;
            scope.color=option;
            scope.onColorChanged({newColor: option, oldColor: old});
          }

        };
        scope.showPalette =function(){
          scope.clickVar=true;
        };

      }
    };
  });
