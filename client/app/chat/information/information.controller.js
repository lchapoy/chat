'use strict';

class InformationCtrl {
  constructor(Chat,EventNotify,$scope,$mdDialog,sideNavToggler){
    this.user=Chat.getUser();
    this.roomId="NoID";
    this.selection=null;
    this.Chat=Chat;
    this.toggleInfo=sideNavToggler.triggerToggle('information');
    //***********************************************************
    //Function that will be trigger whenever the selection change
    var selectionChange=()=>{
      var userSelection=Chat.getSelection();
      if(userSelection) {
        this.roomId = userSelection._id;
        if (userSelection.kind == "par") {
          this.selection = userSelection.members[0];
        } else
          this.selection = userSelection;
      }else{
        this.selection =null;
      }
    };
    //Event listener
    EventNotify.subscribe($scope,selectionChange);
    //***********************************************************
    //Add User Dialog Box
    this.showDialog=function ($event) {
      $mdDialog.show({
        parent: angular.element(document.body),
        targetEvent: $event,
        templateUrl: 'components/addUsersToGroup/addUsersToGroup.html',
        locals:{
          group:this.selection
        },
        controller: 'AddUsersToGroupCtrl',
        controllerAs: 'u2gCtrl'
      });
    }
  }
  //***********************************************************
  //Prototype Function
  deleteFriendFromGroup=(friendId,groupName)=>{
    this.Chat.deleteFriendFromGroup({roomId:this.roomId,friendId,groupName});
  };

  deleteGroup=()=>{
    this.Chat.deleteGroup({roomId:this.roomId});
    this.toggleInfo();
  };

  exitGroup=(groupName)=>{
    if(this.selection.admin!=this.user._id)
      this.Chat.exitGroup({roomId:this.roomId,groupName,newAdmin: this.selection.admin});
    else{
      this.Chat.exitGroup({roomId:this.roomId,groupName,newAdmin: this.selection.members[0]._id});
    }
    this.toggleInfo();
  };
  deleteFriend=()=>{
    this.Chat.deleteFriend({id:this.roomId,friendId:this.selection._id});
    this.toggleInfo();
  };

}

angular.module('chatYeoApp')
  .controller('InformationCtrl', InformationCtrl);

  /*function ($scope,Chat,$mdDialog,EventNotify) {

    $scope.user=Chat.getUser();
    $scope.roomId="NoID";
    $scope.selection=null;

    function selectionChange(){
      var userSelection=Chat.getSelection();
      if(userSelection) {
        $scope.roomId = userSelection._id;
        if (userSelection.kind == "par") {
          $scope.selection = userSelection.members[0];
        } else
          $scope.selection = userSelection;
      }else{
        $scope.selection =null;
      }

    }

    EventNotify.subscribe($scope,selectionChange);


    $scope.deleteFriendFromGroup=(friendId,groupName)=>{
      Chat.deleteFriendFromGroup({roomId:$scope.roomId,friendId,groupName});

    };

    $scope.deleteGroup=()=>{
      Chat.deleteGroup({roomId:$scope.roomId});
      $scope.toggleInfo();
    };
    $scope.exitGroup=(groupName,newAdmin)=>{
      if($scope.selection.admin!=$scope.user._id)
        Chat.exitGroup({roomId:$scope.roomId,groupName,newAdmin: $scope.selection.admin});
      else{
        console.log($scope.selection.members[0]._id);
        Chat.exitGroup({roomId:$scope.roomId,groupName,newAdmin: $scope.selection.members[0]._id});
      }
      $scope.toggleInfo();
    };
    $scope.deleteFriend=()=>{
      Chat.deleteFriend({id:$scope.roomId,friendId:$scope.selection._id});
      $scope.toggleInfo();
    };



  });
*/
