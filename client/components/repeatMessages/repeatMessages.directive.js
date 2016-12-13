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
        scrollFn:'&'
      },
      replace:true,
      link: function (scope, element, attrs) {
        var messageContainer=element[0];
        var mlen=scope.messages.length;
        scope.fromOrTo=function(origin){
          if(origin==scope.userId){
           return 'me';
          }
          else{
            return 'from';
          }
        };
        scope.$watch('messages.length',()=>{
          var rest=messageContainer.scrollHeight-messageContainer.scrollTop-363;
          if((rest)<100) {

            $timeout(()=> {
              messageContainer.scrollTop = messageContainer.scrollHeight;
            }, 1);
          } else if((scope.messages.length-mlen>=5)){
            $timeout(()=>{
              messageContainer.scrollTop=messageContainer.scrollHeight-rest+580;
            },1)
          }
          mlen=scope.messages.length;
        })

      }
    };
  });
