'use strict';

angular.module('instagramApp')
  	.config(function ($stateProvider) {
    	$stateProvider
      		.state('app.search', {
        		url: '/search',
        		abstract: true,
        		template: '<ui-view/>',
        		/*controller: function($state) {
        			if($state.is('app.SearchCtrl')) {
	    		  		$state.go('.list');
	    	  		}
        		}*/
      	})
      	.state('app.search.list', {
		      	url: '/',
		      	templateUrl: 'app/search/search.html',
		      	controller: 'SearchCtrl',
		      	authenticate: true,
			  	role: ['ADMIN','MANAGER']
	   	});
  	});
