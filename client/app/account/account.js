'use strict';

angular.module('instagramApp')
  .config(function ($stateProvider) {
	  $stateProvider
	  .state('login', {
	    url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
    .state('unauthorized', {
        url: '/unauthorized',
        templateUrl: 'app/account/login/unauthorized.html',
        controller: 'LoginCtrl'
      })
     .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
     .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      });
  });