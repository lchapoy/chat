'use strict';

class AddUsersToGroupCtrl{
  filterSelected=true;

  constructor($scope, $mdDialog, Chat,group){
    //Class Global variable
    this.rooms=Chat.getRooms();
    this.contacts=[];
    this.allContacts=[];
    this.$mdDialog=$mdDialog;
    this.Chat=Chat;
    //Constructor private variable
    var ids={};
    //Get the friends that are already in the group
    angular.forEach(group.members,(contact)=>{
      ids[contact._id]=true;
    });
    //Get the rest of the friends
    angular.forEach(this.rooms,(contact)=>{
      var dummy=contact.members[0];
      dummy._lowername=dummy.name.toLowerCase();
      if(!ids[dummy._id])
        this.allContacts.push(dummy);
    });
    //Add Friend to group function
    this.addFriendToGroup=()=>{
      var membersId=[];
      angular.forEach(this.contacts,(user)=>{
        membersId.push(user._id);
      });
      if(membersId.length>0) {
        Chat.addFriendToGroup({roomId: group._id, membersId, groupName: group.name});
        $mdDialog.hide();
      }
    };

  }
  //************************************************************
  //Prototype functions
  createFilterFor=(query)=> {
    var lowercaseQuery = angular.lowercase(query);
    return function filterFn(contact) {
      return (contact._lowername.indexOf(lowercaseQuery) != -1)||(contact.email.indexOf(lowercaseQuery) != -1);
    };
  };

  querySearch=(query)=>{
    var results = query ?
      this.allContacts.filter(this.createFilterFor(query)) : [];
    return results;
  };

  closeDialog = function () {
    this.$mdDialog.hide();
  };

}

angular.module('chatYeoApp')
  .controller('AddUsersToGroupCtrl',AddUsersToGroupCtrl);
