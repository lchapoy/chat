'use strict';

angular.module('chatYeoApp')
  .controller('ChatCtrl', function ($scope,$mdSidenav,User) {
    $scope.$on('pushChanges', function( event, message ){
      $scope.$broadcast( message.name, message.data );
    });
    $scope.toggleAddContact=buildToggler('addContact');
    $scope.toggleAddGroup=buildToggler('addGroup');
    $scope.toggleContacts=buildToggler('contacts');
    $scope.toggleInfo=buildToggler('information');

    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            console.log("toggle " + navID + " is done");
          });
      }
    }
    //$scope.
      /*function isShow(sidebar){
        return function(){

          console.log(sidebar+" " +$mdSidenav(sidebar).isOpen())
          $mdSidenav(sidebar).isOpen();
        }
      };*/
    console.log("chat running")
  });
