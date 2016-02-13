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
      // $scope.$emit('deleteFriend');
      //$scope.selection=Chat.getSelection();
    };
    $scope.exitGroup=(groupName)=>{
      Chat.exitGroup({roomId:$scope.roomId,groupName});
      // $scope.$emit('deleteFriend');
      //$scope.selection=Chat.getSelection();
    };
    $scope.deleteFriend=()=>{
      Chat.deleteFriend({id:$scope.roomId,friendId:$scope.selection._id});
      // $scope.$emit('deleteFriend');
      //$scope.selection=Chat.getSelection();
    };

   /* $mdDialog.show({
      controller:()=>{
        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
          $mdDialog.hide(answer);
        };
      },
      templateUrl: 'dialog1.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: useFullScreen
    })
      .then(function(answer) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });

*/
    $scope.showDialog=showDialog;
    function showDialog($event) {
      var parentEl = angular.element(document.body);

      $mdDialog.show({
        parent: parentEl,
        targetEvent: $event,
        template: '<md-dialog aria-label="List dialog">' +
        '<md-toolbar>'+
        '<div class="md-toolbar-tools">'+
        '<h2>Choose Friend to be Added</h2>'+
        '<span flex></span>'+
        '</div>'+
        '</md-toolbar>'+
        '  <md-dialog-content  class="md-padding autocomplete">' +
        '   <md-contact-chips'+
        '     ng-model="contacts"'+
        '     md-contacts="querySearch($query)"'+
        '     md-contact-name="name"'+
        '     md-contact-image="img"'+
        '     md-contact-email="email"'+
        '     md-require-match="true"'+
        '     md-highlight-flags="i"'+
        '     filter-selected="filterSelected"'+
        '   placeholder="To">'+
        '</md-contact-chips>'+
        '  </md-dialog-content>'+
        '  <md-dialog-actions>' +
        '    <md-button ng-click="addFriendToGroup()" class="md-secondary">' +
        '      Add Friend' +
        '    </md-button>' +
        '    <md-button ng-click="closeDialog()" class="md-primary">' +
        '      Close Dialog' +
        '    </md-button>' +
        '  </md-dialog-actions>' +
        '</md-dialog>',
        locals:{
          group:$scope.selection
        },
        controller: DialogController
      });
      function DialogController($scope, $mdDialog, Chat,group) {
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
        //$scope.contacts=[$scope.allContacts[0]];
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
            //$scope.$emit('deleteFriend');
            //$scope.selection=Chat.getSelection();
            $mdDialog.hide();
          }
        };
      }
    }

  });
