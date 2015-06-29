'use strict';

angular.module('instagramApp')
  .controller('ReportsCtrl', function ($scope, $http, Restangular,Auth) {
		$scope.init = function() {		  	
			$scope.params = {};
			$scope.colors = ['#254117','#0000FF','#FF0000','#FFA500','#800080','#00FFFF','#A52A2A','#FFFF00','#00800','#000000'];
			$scope.dateRange = {};
			$scope.dateRange.startDate = moment().subtract('days', 6);
			$scope.dateRange.endDate = moment();
			
			$scope.ranges = {
		         'Today': [moment(), moment()],
		         'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
		         'Last 7 Days': [moment().subtract('days', 6), moment()],
		         'Last 30 Days': [moment().subtract('days', 29), moment()],
		         'This Month': [moment().startOf('month'), moment().endOf('month')],
		         'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
		    };					
		};
	  	  
	  	$scope.initDateRanges = function() {
			$scope.dateRange = {};
			$scope.dateRange.startDate = moment().subtract('days', 6);
			$scope.dateRange.endDate = moment();
		}

		$scope.pdf = function(){
			console.log("pdf function..");
			var basePdf = Restangular.one('bookings/pdf-file');
				return basePdf.get().then(function(data){
					console.log("pdf data", data);
				});
		};
	  
	  	$scope.initBookingReports = function() {
		  $scope.init();
		  $scope.$watch('dateRange', function(dateRange) {								
			$scope.from = moment(dateRange.startDate._d).format('YYYY-MM-DD');
			$scope.to = moment(dateRange.endDate._d).format('YYYY-MM-DD');
			$scope.params.from = $scope.from;
			$scope.params.to = $scope.to;
		}, true);

		$scope.resetBookings = function(){										
			$scope.initDateRanges();
			$scope.params.from = moment($scope.dateRange.startDate._d).format('YYYY-MM-DD');
			$scope.params.to = moment($scope.dateRange.endDate._d).format('YYYY-MM-DD');
			$scope.params.booking_status = '';
			$scope.params.booked_for = '';
			$scope.params.service_provider = '';						
			console.log("ResetStatus Params Values : ", $scope.params);
			$scope.initBookingStatusCount();			
		};	
		
		$scope.searchBookings = function(){			
			$scope.initBookingStatusCount();			
		};


		$scope.initBookingStatusCount = function(){
			var baseCallsCountReport = Restangular.one('bookings/stats');
				return baseCallsCountReport.get($scope.params).then(
					function(result) {
						console.log("BookingReports Rsp Data :", result);
						$scope.total_confirmed_bookings = 0;
						$scope.total_confirmed_amt = 0;
						$scope.total_bookings = result.booking_total;
						$scope.booking_status_counts = result.booking_status_counts;						

						for(var i=0; i < $scope.booking_status_counts.length; i++){
							if($scope.booking_status_counts[i]._id == "CONFIRMED"){
								$scope.total_confirmed_bookings = $scope.booking_status_counts[i].count;
								$scope.total_confirmed_amt = $scope.booking_status_counts[i].amount;								
							}							
						}
						
				});	
		};
				 				 	 
	  }; 

	  $scope.initAllEmpRequests = function() {
				$scope.init();
				var baseEmpRequests= Restangular.all('emp-requests/all');
				return baseEmpRequests.getList().then(function(empRequests) {
					console.log(empRequests);
					$scope.allEmpRequests = empRequests;
					return empRequests;
				});
			};

			$scope.initAllEmployees = function() {
				$scope.init();
				var baseEmployees= Restangular.all('employees/all');
				return baseEmployees.getList().then(function(employees) {
					console.log(employees);
					$scope.allEmployees = employees;
					return employees;
				});
			};

			$scope.initAllGrades = function() {				
				$scope.init();
				var baseGrades = Restangular.all('grades/all');
				return baseGrades.getList().then(function(grades) {
					console.log(grades);
					$scope.allGrades = grades;					
					return grades;
				});
			};

			$scope.initCars = function(gradeId) {				
				$scope.init();
				var baseGrades = Restangular.one('grades',gradeId);
				return baseGrades.get().then(function(grade) {
					console.log(grade);
					$scope.allCars = grade.cars;					
					return grade;
				});
			};

			$scope.initAllServiceProvider = function() {				
				$scope.init();
				var baseServiceProviders = Restangular.all('service-providers/all');
				return baseServiceProviders.getList().then(function(serviceProviders) {
					console.log(serviceProviders);
					$scope.allServiceProviders = serviceProviders;					
					return serviceProviders;
				});
			};


	  	 
  });
