'use strict';

class sideNavToggler {
  constructor($mdSidenav){
    this.togglers={};
    this.$mdSidenav=$mdSidenav;
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
  triggerClose=(navID) =>{
    return ()=>{this.$mdSidenav(navID).close()};
  }
}


angular.module('chatYeoApp')
  .service('sideNavToggler', sideNavToggler);

