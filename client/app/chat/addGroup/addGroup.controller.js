'use strict';




class AddGroupCtrl {
  //start-non-standard
  errors = {};
  arrId=[];
  //end-non-standard

  constructor($scope,Comm,Chat,sideNavToggler,$mdDialog) {
    this.Comm=Comm;
    this.scope = $scope;
    this.Chat=Chat;
    this.rooms=Chat.getRooms();
    this.groupName='';
    this.toggleAddGroup=sideNavToggler.triggerToggle('addGroup');
    this.$mdDialog=$mdDialog;
  }
  newGroup = function () {
    if(this.arrId.length==0){
      this.errors.other="You should add a friend";
    }else if(this.groupName==''||this.groupName==undefined){
      this.errors.other="You should add a name";
    }else{
      this.errors.other='';
      this.Comm.createGroup({groupName:this.groupName,membersId:this.arrId,img:"/assets/images/group_no_image.png"})
        .then((group)=> {
          this.Chat.newGroup(group);
          this.groupName='';
          this.toggleAddGroup();
        })
    }
  };
  addMemberId =function(id){
    this.arrId.push(id);
  };
  removeMemberId =function(id){
    var index=this.arrId.indexOf(id);
    this.arrId.splice(index,1);
  };
  showDialog = function ($event) {
    $mdDialog.show({
      parent: angular.element(document.body),
      targetEvent: $event,
      templateUrl: 'components/addUsersToGroup/addUsersToGroup.html',
      locals: {
        group: this.selection
      },
      controller: 'AddUsersToGroupCtrl',
      controllerAs: 'u2gCtrl'
    });
  };
  /*myFilter = function (item) {
    return item === false || item === 'undefined';
  };*/

}

angular.module('chatYeoApp')
  .controller('AddGroupCtrl',AddGroupCtrl);
