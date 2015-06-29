'use strict';

angular.module('instagramApp')
  .config(function ($stateProvider) {
	  $stateProvider
	    .state('app.dashboard', {
	      url: '/',
	      templateUrl: 'app/dashboard/dashboard.html',
	      controller: 'DashboardCtrl',
	      authenticate: true
	    });
  });
