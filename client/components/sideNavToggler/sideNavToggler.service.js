'use strict';

class sideNavToggler {
  constructor($mdSidenav){
    this.togglers={};
    this.buildToggler=(navID)=> {
      return this.togglers[navID] = function () {
        $mdSidenav(navID)
          .toggle()
      };
    };
  }
  triggerToggle=(navID) =>{
   return this.togglers[navID];
  }
}


angular.module('chatYeoApp')
  .service('sideNavToggler', sideNavToggler);

