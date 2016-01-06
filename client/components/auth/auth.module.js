'use strict';

angular.module('chatYeoApp.auth', [
  'chatYeoApp.constants',
  'chatYeoApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
