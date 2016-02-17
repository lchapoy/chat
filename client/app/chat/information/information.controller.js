'use strict';

angular.module('chatYeoApp')
  .controller('InformationCtrl', function ($scope,Chat,$mdDialog,EventNotify) {

    $scope.user=Chat.getUser();
    $scope.roomId="NoID";
    $scope.selection="No Selected";

    function selectionChange(){
      var userSelection=Chat.getSelection();
      $scope.roomId=userSelection._id;
      if(userSelection.kind=="par") {
        $scope.selection = userSelection.members[0];
      }else
        $scope.selection =userSelection;
    }

    EventNotify.subscribe($scope,selectionChange);


    $scope.deleteFriendFromGroup=(friendId,groupName)=>{
      Chat.deleteFriendFromGroup({roomId:$scope.roomId,friendId,groupName});

    };

    $scope.deleteGroup=()=>{
      Chat.deleteGroup({roomId:$scope.roomId});

    };
    $scope.exitGroup=(groupName)=>{
      Chat.exitGroup({roomId:$scope.roomId,groupName});

    };
    $scope.deleteFriend=()=>{
      Chat.deleteFriend({id:$scope.roomId,friendId:$scope.selection._id});

    };

    $scope.showDialog=showDialog;
    function showDialog($event) {
      $mdDialog.show({
        parent: angular.element(document.body),
        targetEvent: $event,
        templateUrl: 'components/addUsersToGroup/addUsersToGroup.html',
        locals:{
          group:$scope.selection
        },
        controller: 'AddUsersToGroupCtrl'
      });
    }

  });
