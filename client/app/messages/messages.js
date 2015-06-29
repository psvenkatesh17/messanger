'use strict';

angular.module('instagramApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.messages', {
        url: '/messages',
        abstract: true,
        template: '<ui-view/>',
        
      })
      .state('app.messages.list', {
		      url: '/',
		      templateUrl: 'app/messages/messages.html',
		      controller: 'MessagesCtrl',
		      authenticate: true
	    })
	    .state('app.messages.create', {
		      url: '/create',
		      templateUrl: 'app/messages/create_message.html',
		      controller: 'MessagesCtrl',
		      authenticate: true
		});
  });