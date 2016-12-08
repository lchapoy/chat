'use strict';

angular.module('chatYeoApp', [
  'chatYeoApp.auth',
  'chatYeoApp.admin',
  'chatYeoApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'validation.match',
  'ngMaterial',
  'ngMessages',
  'ngAnimate',
  'ngMdIcons'
])
  .config(function($urlRouterProvider, $locationProvider, $mdThemingProvider) {
    $urlRouterProvider
      .otherwise('/');
    $locationProvider.html5Mode(true);
    $mdThemingProvider.theme('default')
      .primaryPalette('orange')
      .warnPalette('indigo')
      .accentPalette('blue').foregroundPalette[3] = "gainsboro";


  });
