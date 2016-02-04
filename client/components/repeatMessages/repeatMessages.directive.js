'use strict';

angular.module('chatYeoApp')
  .directive('repeatMessages', function () {
    return {
      templateUrl: 'components/repeatMessages/repeatMessages.html',
      restrict: 'EA',
      scope:{
        messages:'=messages',
        userId:'=userId',
        group:'=group'
      },
      link: function (scope, element, attrs) {
        console.log(scope.messages);
        console.log(scope.group);
        scope.fromOrTo=function(origin){
          if(origin==scope.userId){
           return 'me';
          }
          else{
            return 'from';
          }
        }

      }
    };
  });
