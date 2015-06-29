'use strict';

angular.module('instagramApp').controller('MessageCtrl', 
	function($scope, $modal, $state, Auth) {
	$scope.open = function (receiver) {			
		console.log(receiver.mobile);
      $scope.modalInstance = $modal.open({
        templateUrl: 'modalMessageDetails.html',
        controller: 'MessageModalInstanceCtrl',
        resolve: {
        	receiver: function(){
        		return receiver;
        	}	
        }
    });

    $scope.modalInstance.result.then(function (select) {
        console.log('ok update', select);
        $modalInstance.close(true);
      }, function () {
      	if(Auth.isServiceProvider()){
      		$state.reload();
      	}
       console.log('Modal dismissed');
      });
    };
});

angular.module('instagramApp').controller('MessageModalInstanceCtrl', 
	function($scope, $modalInstance, Restangular, $state, $stateParams, receiver) {

		$scope.init = function() {
			$scope.alerts = [];
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};
		};

		$scope.initMessageDetails = function() {			
			$scope.init();
			$scope.message = {};
			$scope.message.mobileNo = receiver.mobile;
			$scope.message.receiver = receiver._id;

			$scope.sendMessage = function () {
				console.log($scope.message);

				var baseMessage = Restangular.all('messages');
				baseMessage.post($scope.message).then(function (data) {
					console.log("Response Data:", data);
				});	     
		    };
		};	

		$scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		};
});