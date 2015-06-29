'use strict';

angular.module('instagramApp').controller('SearchCtrl',
	 	function($scope, Restangular, dialogs, $stateParams, Auth) {
			$scope.init = function() {
				$scope.user = Auth.getCurrentUser()._id;				
				$scope.alerts = [];
				$scope.closeAlert = function(index) {					
					$scope.alerts.splice(index, 1);
				};
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
		
			$scope.initBookings = function() {
				
				$scope.init();				
				$scope.params = {};								

				$scope.$watch('dateRange', function(dateRange) {					
					$scope.from = moment(dateRange.startDate._d).format('YYYY-MM-DD');
					$scope.to = moment(dateRange.endDate._d).format('YYYY-MM-DD');
					$scope.params.from = $scope.from;
					$scope.params.to = $scope.to;								
				}, true);

				$scope.searchBookings = function(){					
					$scope.getBookingsPagedDataAsync($scope.params);
				};
				
				$scope.resetBookings = function(){
					$scope.initDateRanges();
					$scope.params.from = moment($scope.dateRange.startDate._d).format('YYYY-MM-DD');
					$scope.params.to = moment($scope.dateRange.endDate._d).format('YYYY-MM-DD');											
					$scope.params.booking_status = '';
					$scope.params.booked_for = '';
					$scope.params.service_provider = '';
					$scope.getBookingsPagedDataAsync($scope.params);
				};
				
				$scope.filterOptions = {
					filterText : "",
					useExternalFilter : true
				};

				$scope.totalServerItems = 0;

				$scope.pagingOptions = {
					pageSizes : [ 15, 25, 50 ],
					pageSize : 15,
					currentPage : 1
				};
				
				$scope.maxPages = function() {
					return parseInt(Math.ceil($scope.totalServerItems / $scope.pagingOptions.pageSize));
				};
				
				$scope.validateCurrentPage = function() {
					if($scope.pagingOptions.currentPage > $scope.maxPages()) {
						$scope.pagingOptions.currentPage = $scope.maxPages();
					}
					if($scope.pagingOptions.currentPage < 1) {
						$scope.pagingOptions.currentPage = 1;
					}
					$scope.pagingOptions.currentPage = parseInt($scope.pagingOptions.currentPage);
						
				};
				$scope.$watch('totalServerItems', function(newVal, oldVal) {
					if(newVal !== oldVal) {
						$scope.validateCurrentPage();
					}
				}, true);
				
				$scope
						.$watch(
								'pagingOptions',
								function(newVal, oldVal) {
									console.log(newVal);
									console.log(oldVal);
									if((newVal.currentPage !== oldVal.currentPage)
						 			 || (newVal.pageSize !== oldVal.pageSize)) {
										$scope.validateCurrentPage();
										$scope.getBookingsPagedDataAsync($scope.params);
									}
																		
								}, true);				

				$scope.mySelection = [];

				$scope.gridOptions = {
					data : 'bookings',
					enablePaging : true,
					showFooter : true,
					totalServerItems : 'totalServerItems',
					pagingOptions : $scope.pagingOptions,
					filterOptions : $scope.filterOptions,
					selectedItems : $scope.mySelection,
					keepLastSelected: false,
					multiSelect: true,
					selectWithCheckboxOnly : true,
					showSelectionCheckbox : true,					
				};

				$scope.confirmStatus = "CONFIRMED";
				$scope.requestStatus = "REQUEST";
				$scope.cancelledStatus = "CANCELLED";
				
				if(Auth.isAdmin() || Auth.isManager()){
				$scope.gridOptions.columnDefs = [						
						{
							field : 'booked_for.name',
							displayName : 'Booked For'
						},							
						{
							field : 'booking_time',
							displayName : 'Booking Time',
							cellFilter: 'date: \'dd-MM-yyyy h:mm a \''
						},
						{
							field : 'duration',
							displayName : 'Duration',
							cellTemplate: '<div style="padding-left:10px">{{row.entity.duration.n}} {{row.entity.duration.unit}}</div>'
						},
						{
							field : 'grade.name',
							displayName : 'Grade'
						},
						/*{
							field : 'booked_by.name',
							displayName : 'Booked By'
						},*/
						{
							field : 'service_provider.business_name',
							displayName : 'Service Provider'
						},
						{
							field : 'car.name',
							displayName : 'Car'
						},
						{
							field : 'amount',
							displayName : 'Amount',
							cellFilter: 'currency :"Rs " '
						},
						{
							field : 'booking_status',
							displayName : 'Status'
						}	
						/*{
							field : 'driver_details',
							displayName : 'Driver Details',
							cellTemplate: '<div style="padding-left:10px">{{row.entity.driver_details.name}}</div>'
						},		
						{
							field : '',
							displayName : 'Actions',
							sortable : false,
							cellTemplate : '<div class="text-center"><div class="btn-group btn-group-xs">'
									+ '<a href="javascript:void(0)" ui-sref="^.edit({bookingId: row.entity._id})"' 
									+ ' data-toggle="tooltip" title=""'
									+ ' class="btn btn-sm btn-info" data-original-title="Edit"><i class="fa fa-pencil"></i></a>'									
									+ '<a href="javascript:void(0)"'
									+ ' ng-click="deleteRow(row)" data-toggle="tooltip" title=""'
									+ ' class="btn btn-sm btn-danger" data-original-title="Delete"><i class="fa fa-times"></i></a></div></div>'

						}*/
						];
				}
						
				$scope.deleteRow = function(row) {
					console.log(row.entity);
					dialogs.confirm('Confirm',
							'Are you sure you want to delete?').result
							.then(function(btn) {
								console.log('yes');
								var bookingToDelete = row.entity;
								bookingToDelete.remove({
									_id : bookingToDelete._id
								}).then(function(rsp) {
									console.log(rsp);
									if (rsp.meta.status == 200) {
										$scope.alerts = [];
										$scope.alerts.push({type: 'success',
												msg: rsp.meta.msg});
										$scope.loadBookingsTable();
									} else {
										$scope.alerts = [];
										$scope.alerts.push({type: 'danger',
											msg: rsp.meta.msg});
									}

								});
							}, function(btn) {
								console.log('no');
							});
				};

				$scope.viewRow = function(row) {
					console.log(row.entity);
				};
				
				$scope.multiDelete = function(){
					$scope.init();
					if($scope.mySelection.length >= 1){					
						$scope.mySelectionIds = [];
						for(var i=0; i < $scope.mySelection.length; i++){
							$scope.mySelectionIds[i] = $scope.mySelection[i]._id;
						}
						console.log("Array of ids:", $scope.mySelectionIds);
						dialogs.confirm('Confirm',
						'Are you sure you want to delete?').result
						.then(function(btn) {
							console.log('yes');						
						var baseBookings = Restangular.all('bookings');
						baseBookings.customDELETE('', '', {'Content-Type': 'application/json'},
								{ids: $scope.mySelectionIds}).then(function(data) {
						    console.log(data);
						    $scope.data = data;
						    $scope.status = data.meta.status + ": " + data.meta.msg;    
				    		
						    if (data.meta.status == 200) {
							    $scope.alerts = [];
						    	$scope.alerts.push({type: 'success',
									msg: data.meta.msg});
						    	$scope.loadBookingsTable();
						    	$scope.gridOptions.selectAll(false);
						    } else {
						    	$scope.alerts = [];
						    	$scope.alerts.push({type: 'danger',
									msg: data.meta.msg});
						    }						
						  }, function(response) {
						    console.log(response);
						    $scope.alerts = [];
						    $scope.alerts.push({type: 'danger',
								msg: "Unable to delete!"});
						  });
						}, function(btn) {
								console.log('no');
						});
					}else{
						$scope.alerts = [];
						$scope.alerts.push({type: 'danger',
									msg: "Select bookings to delete"});
					}
			};
				$scope.getBookingsPagedDataAsync = function(filters) {
					var pageSize = $scope.pagingOptions.pageSize;
					var page = $scope.pagingOptions.currentPage;
					var offset = (page - 1) * pageSize;
					var limit = $scope.pagingOptions.pageSize;
					$scope.getBookings(filters, offset, limit).then(
							function(bookings) {
								$scope.setPagingData(bookings, page,
										pageSize, bookings.total);
							});
				};

				$scope.getBookings = function(filters, offset, limit) {
					var baseBookings = Restangular.all('bookings');
					filters = filters ? filters : {};
					filters.offset = offset;
					filters.limit = limit;
					return baseBookings.getList(filters).then(
							function(bookings) {
								console.log(bookings);
								return bookings;
							});
				};

				$scope.setPagingData = function(data, page, pageSize,
						total) {
					$scope.bookings = data;
					$scope.totalServerItems = total;
					if (!$scope.$$phase) {
						$scope.$apply();
					}
				};

				$scope.loadBookingsTable = function() {
					$scope.getBookingsPagedDataAsync($scope.params);
				};				

				$scope.loadBookingsTable();				
								
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


