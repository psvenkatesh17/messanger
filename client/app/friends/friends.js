'use strict';

angular.module('instagramApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.friends', {
        url: '/friends',
        abstract: true,
        template: '<ui-view/>',
        
      })
      .state('app.friends.list', {
		      url: '/',
		      templateUrl: 'app/friends/friends.html',
		      controller: 'FriendsCtrl',
		      authenticate: true
	    })
	    .state('app.friends.create', {
		      url: '/create',
		      templateUrl: 'app/friends/create_friend.html',
		      controller: 'FriendsCtrl',
		      authenticate: true
		});
  }); 