'use strict';

class ChatCtrl{
  constructor(Chat,sideNavToggler){
    Chat.reset();
    //Create Togglers
    sideNavToggler.buildToggler('addContact');
    sideNavToggler.buildToggler('addGroup');
    sideNavToggler.buildToggler('contacts');
    sideNavToggler.buildToggler('information');
  }

}

angular.module('chatYeoApp')
  .controller('ChatCtrl',ChatCtrl);

  //function ($scope,sideNavToggler,User,Auth,Chat) {

    //Chat.reset();
    //$scope.toggleAddContact=sideNavToggler.buildToggler('addContact');
    //$scope.toggleAddGroup=sideNavToggler.buildToggler('addGroup');
    //$scope.toggleContacts=sideNavToggler.buildToggler('contacts');
    //$scope.toggleInfo=sideNavToggler.buildToggler('information');


 // });
