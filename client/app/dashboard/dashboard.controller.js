'use strict';

angular.module('instagramApp')
  .controller('DashboardCtrl', function ($scope, $http, Restangular,Auth) {	  	
	  
	  $scope.initDashboard = function() {
		  var user = "558a4277e4dd3c201808081f";
		  var baseMessages = Restangular.one('messages/stats');	
		  baseMessages.get({receiver: user}).then(function (data) {
		  	console.log("DATA:", data);
		  	$scope.msgStats = data.response.stats;
		  	for(var i = 0 ; i < data.response.stats.statusCount.length ; i++) {
		  		if(data.response.stats.statusCount[i]._id == "READ") {
		  			$scope.read = data.response.stats.statusCount[i].count;
		  		} else if(data.response.stats.statusCount[i]._id == "UNREAD") {
		  			$scope.unread = data.response.stats.statusCount[i].count;
		  		}
		  	}
		  });	 				 	  
	  }; 	 
  });