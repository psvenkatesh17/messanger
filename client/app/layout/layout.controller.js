'use strict';

angular.module('instagramApp').controller('layoutCtrls', 
	function($scope, $location, Auth) {

			$scope.isActive = function(route) {
				return route === $location.path();
			};

			$scope.logout = function() {
				Auth.logout();
			};
			console.log("layout ctrl currentUser", Auth.getCurrentUser());
			$scope.username = Auth.getCurrentUser().username;				
			$scope.user = Auth.getCurrentUser();			
		});