'use strict';

(function() {

class MainController {

  constructor($http) {
    this.$http = $http;
    this.awesomeThings = [];
  }

}

angular.module('chatYeoApp')
    .controller('MainController', MainController);

})();
