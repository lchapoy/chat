'use strict';

class LoginController {
  //start-non-standard
  user = {};
  errors = {};
  submitted = false;
  //end-non-standard

  constructor(Auth, $state) {
    this.Auth = Auth;
    this.$state = $state;
  }

  login(form) {
    this.submitted = true;
    console.log('luis '+ form.$valid)
    if (form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
      .then(() => {
        // Logged in, redirect to home
          console.log('luis')
        this.$state.go('chat');
      })
      .catch(err => {
        this.errors.other = err.message;
      });
    }
  }
}

angular.module('chatYeoApp')
  .controller('LoginController', LoginController);
