'use strict';

angular.module('chatYeoApp')
  .directive('canvasDrawing', function ($window,$timeout) {
    return {
      restrict: 'EA',
      scope:{
        sendCanvas:'&'
      },
      templateUrl: 'components/canvasDrawing/canvasDrawing.html',
      link: function (scope, element, attrs) {
        var canvas= angular.element(element.children().children()[0]);
        var ctx = canvas[0].getContext('2d');
        var container = canvas.parent().parent().parent();
        var drawWidth ={
          '20':2,
          '40':5,
          '60':10
        };
        var drawLine=2;

        scope.color='#FFF';
        scope.options = ['#FF8A80', '#FFD180', '#FFFF8D', '#CFD8DC', '#80D8FF', '#A7FFEB', '#CCFF90'];
        scope.getWindowWidth =function(){
          return container[0].offsetWidth;
        };
       scope.$watch(scope.getWindowWidth,function(lastValue,newValue) {

         reset();
         $timeout(function () {
           respondCanvas();
         }, 100);

        });


         scope.colorChanged = function(newColor, oldColor) {
          scope.color=newColor;
        };
        scope.changeWidth = function(item) {
          drawLine=drawWidth[item];
        };

        function respondCanvas(){

          canvas.attr('width', container[0].clientWidth-50 ); //max width

        }

        scope.send=function (){
          scope.sendCanvas()(canvas[0].toDataURL());
          reset();
        };

        scope.clear=function (){
          reset();
        };

        respondCanvas();
        // variable that decides if something should be drawn on mousemove
        var drawing = false;

        // the last coordinates before the current move
        var centerX;
        var centerY;

        canvas.bind('mousedown', function(event){

          centerX = event.offsetX;
          centerY = event.offsetY;

          // begins new line
          ctx.beginPath();
          ctx.moveTo(centerX,centerY);

          drawing = true;
        });

        canvas.bind('mousemove', function(event){
          if(drawing){
            // get current mouse position
            var currentX = event.offsetX;
            var currentY = event.offsetY;

            draw(centerX, centerY, currentX, currentY);
          }

        });

        canvas.bind('mouseup', function(event){
          // stop drawing
          drawing = false;
        });

        canvas[0].addEventListener('touchstart', function(event){

            event = event.changedTouches[0];

          var move = getMousePos(canvas[0],event);

           centerX = move.x;
           centerY = move.y;

          // begins new line
          ctx.beginPath();
          ctx.moveTo(move.x,move.y);

          drawing = true;
        });

        canvas[0].addEventListener('touchmove', function(event){

          event = event.changedTouches[0];



          if(drawing){
            // get current mouse position
            var move = getMousePos(canvas[0],event);
            // var currentX = event.clientX;
            // var currentY = event.clientY;

            draw(centerX, centerY, move.x, move.y);
          }

        });

        canvas[0].addEventListener('touchend', function(event){
          // stop drawing
          drawing = false;
        });

        // canvas reset
        function reset(){
          //element[0].width = element[0].width;
         ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);
        }

        function draw(startX, startY, currentX, currentY){
          //reset();

          //ctx.rect(startX, startY, sizeX, sizeY);
          ctx.lineTo(currentX,currentY);
          ctx.lineWidth = drawLine;
          // color
          ctx.strokeStyle = scope.color;
          // draw it
          ctx.stroke();
        }
        function getMousePos(canvasDom, mouseEvent) {
          var rect = canvasDom.getBoundingClientRect();
          return {
            x: mouseEvent.clientX - rect.left,
            y: mouseEvent.clientY - rect.top
          };
        }
      }

    };
  });
