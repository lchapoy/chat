'use strict';

angular.module('chatYeoApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      })
      .state('logout', {
        url: '/logout?referrer?force',
        referrer: 'main',
        template: '',
        controller: function($state, Auth,socket,$timeout,$mdDialog) {

          var referrer = $state.params.referrer ||
                          $state.current.referrer ||
                          'main';
          var force = $state.params.force;
          //Confirm dialog box
          if(force){
              var confirm = $mdDialog.confirm()
                .title('Multiple Account Login')
                .textContent('Your account is being used on another machine')
                .ariaLabel('alert')
                .targetEvent()
                .ok('Ok');
              $mdDialog.show(confirm).then( () =>{

              }, function () {

              });
            }
          socket.disconnect();
          //var referrer= $state.params.cookie;
          //if($cookies.get('token')){
            Auth.logout();
          //}
          //$state.go(referrer);
          $timeout(()=>{
            $state.go(referrer);
          },1);

        }
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupController',
        controllerAs: 'vm'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        authenticate: true
      });
  })
  .run(function($rootScope) {
    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
      if (next.name === 'logout' && current && current.name && !current.authenticate) {
        next.referrer = current.name;
      }
    });
  });
