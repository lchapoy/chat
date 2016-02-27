'use strict';

class LoginController {
  //start-non-standard
  user = {};
  errors = {};
  submitted = false;
  //end-non-standard

  constructor(Auth, $state,User, $window,$location,$cookies) {
    this.Auth = Auth;
    this.$state = $state;
    this.User=User;
    this.$window=$window;
    this.$location=$location;
    this.$cookies=$cookies;
  }

  login(form) {
    this.submitted = true;
   //this.User.get().$promise.then((user)=>{
    if(this.$cookies.get('token')) {
      this.$location.path('/main');
      this.$window.location.reload();
    }else{
      if (form.$valid) {
        this.Auth.login({
          email: this.user.email,
          password: this.user.password
        })
          .then(() => {
            // Logged in, redirect to home
            this.$state.go('chat');
          })
          .catch(err => {
            this.errors.other = err.message;
          });
      }
    }

    // this.$window.location.reload();
  // },()=>{

  // });

  }
}

angular.module('chatYeoApp')
  .controller('LoginController', LoginController);
