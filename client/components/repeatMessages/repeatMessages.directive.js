'use strict';

angular.module('chatYeoApp')
  .directive('repeatMessages', function ($timeout) {
    return {
      templateUrl: 'components/repeatMessages/repeatMessages.html',
      restrict: 'EA',
      scope:{
        messages:'=messages',
        userId:'=userId',
        group:'=group',
      },
      replace:true,
      link: function (scope, element, attrs) {
        console.log(scope.messages);
        console.log(scope.group);

        var messageContainer=element[0];

        scope.fromOrTo=function(origin){
          if(origin==scope.userId){
           return 'me';
          }
          else{
            return 'from';
          }
        };
        scope.$watch('messages.length',()=>{
           console.log(messageContainer.scrollHeight);
          $timeout(()=>{
            messageContainer.scrollTop=messageContainer.scrollHeight;
          },1)
        })

      }
    };
  });
