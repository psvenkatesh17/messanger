'use strict';

angular.module('instagramApp').controller('MessagesCtrl',
	 	function($scope, Restangular, dialogs, $stateParams, Auth) {
			$scope.init = function() {				
				$scope.alerts = [];
				$scope.closeAlert = function(index) {					
					$scope.alerts.splice(index, 1);
				};				
			};
		
			$scope.initMessages = function() {
				$scope.init();		
				var user = "558a4277e4dd3c201808081f";
				var baseMessages = Restangular.all('messages');
				baseMessages.getList({receiver:user}).then(function (data) {
					console.log("message:", data);
					$scope.messages = [];
					for(var i = 0 ; i < data.length ; i++) {
						$scope.messages.push(data[i]);
					}
					console.log("loop:", $scope.messages);
				});
			};

				
	
});

