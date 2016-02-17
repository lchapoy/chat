'use strict';

angular.module('chatYeoApp')
  .controller('AddUsersToGroupCtrl', function ($scope, $mdDialog, Chat,group) {
    $scope.closeDialog = function () {
      $mdDialog.hide();
    };
    $scope.addDialog = function () {
      $mdDialog.hide();
    };
    var ids={};
    angular.forEach(group.members,(contact)=>{
      ids[contact._id]=true;
    });
    $scope.rooms=Chat.getRooms();
    $scope.filterSelected=true;
    $scope.querySearch=querySearch;
    $scope.contacts=[];
    $scope.allContacts=[];

    angular.forEach($scope.rooms,function(contact){
      var dummy=contact.members[0];
      dummy._lowername=dummy.name.toLowerCase();
      if(!ids[dummy._id])
        $scope.allContacts.push(dummy);

    });

    /**
     * Search for contacts.
     */
    function querySearch (query) {
      var results = query ?
        $scope.allContacts.filter(createFilterFor(query)) : [];
      return results;
    }
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(contact) {
        return (contact._lowername.indexOf(lowercaseQuery) != -1)||(contact.email.indexOf(lowercaseQuery) != -1);
      };
    }
    $scope.addFriendToGroup=()=>{
      var membersId=[];
      var message='';
      angular.forEach($scope.contacts,(user)=>{
        membersId.push(user._id);
      });
      if(membersId.length>0) {
        Chat.addFriendToGroup({roomId: group._id, membersId, groupName: group.name});
        $mdDialog.hide();
      }
    };
  });
