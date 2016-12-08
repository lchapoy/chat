'use strict';

class ContactsCtrl {

  constructor(Chat,sideNavToggler){
    this.rooms=Chat.getRooms();
    this.groups=Chat.getGroups();
    this.toggleContacts=sideNavToggler.triggerToggle('contacts');
    this.toggleAddContact=sideNavToggler.triggerToggle('addContact');
    this.toggleAddGroup=sideNavToggler.triggerToggle('addGroup');

    this.selectUser=function(kind,index){
      Chat.changeSelection(kind,index);
      this.toggleContacts();
    };

    this.openAddFriends=function(){
      this.toggleAddContact();
      this.toggleContacts();
    };

    this.openAddGroups=function(){
      this.toggleAddGroup();
      this.toggleContacts()
    };
  }
}

angular.module('chatYeoApp')
  .controller('ContactsCtrl', ContactsCtrl);

