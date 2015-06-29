'use strict';

angular.module('instagramApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.groups', {
        url: '/groups',
        abstract: true,
        template: '<ui-view/>',
        /*controller: function($state) {
        	if($state.is('app.groups')) {
	    		  $state.go('.list');
	    	  }
        }*/
      })
      .state('app.groups.list', {
		      url: '/',
		      templateUrl: 'app/groups/groups.html',
		      controller: 'GroupsCtrl',
		      authenticate: true
	    })
	    .state('app.groups.create', {
		      url: '/create',
		      templateUrl: 'app/groups/create_group.html',
		      controller: 'GroupsCtrl',
		      authenticate: true
		})
		.state('app.groups.edit', {
		      url: '/:groupId/edit',
		      templateUrl: 'app/groups/edit_group.html',
		      controller: 'GroupsCtrl',
		      authenticate: true
		});
  });