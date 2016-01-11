'use strict';

angular.module('chatYeoApp')
  .directive('navbar', () => ({
    templateUrl: 'components/navbar/navbar.html',
    restrict: 'E',
    controller: 'NavbarController',
    controllerAs: 'nav',
    link: (scope,el,att,ctr)=>{
      console.log(scope.nav.isLoggedIn())
    }
  }));
