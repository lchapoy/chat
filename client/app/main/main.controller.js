'use strict';

(function() {

class MainController {

  constructor($http,Auth,$state) {
    this.$http = $http;
    this.awesomeThings = [];
    Auth.isLoggedIn(()=>{
      $state.go('chat')
    });

  }

}

angular.module('chatYeoApp')
    .controller('MainController', MainController);

})();
