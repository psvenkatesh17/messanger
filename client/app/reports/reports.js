'use strict';

angular.module('instagramApp')
  	.config(function ($stateProvider) {
    	$stateProvider
      		.state('app.reports', {
        		url: '/reports',
        		abstract: true,
        		template: '<ui-view/>',
        		/*controller: function($state) {
        			if($state.is('app.ReportsCtrl')) {
	    		  		$state.go('.list');
	    	  		}
        		}*/
      	})
      	.state('app.reports.list', {
		      	url: '/',
		      	templateUrl: 'app/reports/reports.html',
		      	controller: 'ReportsCtrl',
		      	authenticate: true,
			  	role: ['ADMIN','MANAGER']
	   	});
  	});  