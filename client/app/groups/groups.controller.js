'use strict';

angular.module('instagramApp').controller('GroupsCtrl',
	 	function($scope, Restangular, dialogs, $stateParams, Auth) {
			$scope.init = function() {				
				$scope.alerts = [];
				$scope.closeAlert = function(index) {					
					$scope.alerts.splice(index, 1);
				};
			};
		
			$scope.initGroups = function() {
				
				$scope.init();				
				$scope.params = {};
				
				$scope.searchGroup = function(){					
					$scope.getGroupsPagedDataAsync($scope.params);
				};
				
				$scope.resetGroup = function(){					
					$scope.params.name = '';
					$scope.getGroupsPagedDataAsync($scope.params);
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
										$scope.getGroupsPagedDataAsync($scope.params);
									}
																		
								}, true);				

				$scope.mySelection = [];

				$scope.gridOptions = {
					data : 'groups',
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

				$scope.gridOptions.columnDefs = [
						{
							field : 'name',
							displayName : 'Name'
						},											
						{
							field : '',
							displayName : 'Actions',
							sortable : false,
							cellTemplate : '<div class="text-center"><div class="btn-group btn-group-xs">'
									+ '<a href="javascript:void(0)" ui-sref="^.edit({groupId: row.entity._id})"' 
									+ ' data-toggle="tooltip" title=""'
									+ ' class="btn btn-sm btn-info" data-original-title="Edit"><i class="fa fa-pencil"></i></a>'
									+ '<a href="javascript:void(0)"'
									+ ' ng-click="deleteRow(row)" data-toggle="tooltip" title=""'
									+ ' class="btn btn-sm btn-danger" data-original-title="Delete"><i class="fa fa-times"></i></a></div></div>'
						}
						];

				$scope.deleteRow = function(row) {
					console.log(row.entity);
					dialogs.confirm('Confirm',
							'Are you sure you want to delete?').result
							.then(function(btn) {
								console.log('yes');
								var groupToDelete = row.entity;
								groupToDelete.remove({
									_id : groupToDelete._id
								}).then(function(rsp) {
									console.log(rsp);
									if (rsp.meta.status == 200) {
										$scope.alerts = [];
										$scope.alerts.push({type: 'success',
												msg: rsp.meta.msg});
										$scope.loadGroupsTable();
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
						var baseGroups = Restangular.all('groups');
						baseGroups.customDELETE('', '', {'Content-Type': 'application/json'},
								{ids: $scope.mySelectionIds}).then(function(data) {
						    console.log(data);
						    $scope.data = data;
						    $scope.status = data.meta.status + ": " + data.meta.msg;    
				    		
						    if (data.meta.status == 200) {
							    $scope.alerts = [];
						    	$scope.alerts.push({type: 'success',
									msg: data.meta.msg});
						    	$scope.loadGroupsTable();
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
									msg: "Select groups to delete"});
					}
			};
				$scope.getGroupsPagedDataAsync = function(filters) {
					var pageSize = $scope.pagingOptions.pageSize;
					var page = $scope.pagingOptions.currentPage;
					var offset = (page - 1) * pageSize;
					var limit = $scope.pagingOptions.pageSize;
					$scope.getGroups(filters, offset, limit).then(
							function(groups) {
								$scope.setPagingData(groups, page,
										pageSize, groups.total);
							});
				};

				$scope.getGroups = function(filters, offset, limit) {
					var baseGroups = Restangular.all('groups');
					filters = filters ? filters : {};
					filters.offset = offset;
					filters.limit = limit;
					return baseGroups.getList(filters).then(
							function(groups) {
								console.log(groups);
								return groups;
							});
				};

				$scope.setPagingData = function(data, page, pageSize,
						total) {
					$scope.groups = data;
					$scope.totalServerItems = total;
					if (!$scope.$$phase) {
						$scope.$apply();
					}
				};

				$scope.loadGroupsTable = function() {
					$scope.getGroupsPagedDataAsync($scope.params);
				};				

				$scope.loadGroupsTable();								
			};
			
			$scope.initCreateGroup = function() {
				$scope.init();
				$scope.group = {};
				//$scope.productType.org = $scope.org;
				
				$scope.addDepartment = function(isValid) {
					if(isValid) {
						var baseDepartments = Restangular.all('departments');
						console.log($scope.department);
						baseDepartments.post($scope.department).then(function(data) {
						    console.log(data);
						    $scope.data = data;
						    $scope.status = data.meta.status + ": " + data.meta.msg;    
				    		
						    if (data.meta.status == 201) {
							    $scope.alerts = [];
						    	$scope.alerts.push({type: 'success',
									msg: data.meta.msg});
						    } else {
						    	$scope.alerts = [];
						    	$scope.alerts.push({type: 'danger',
									msg: data.meta.msg});
						    }						
						  }, function(response) {
						    console.log(response);
						    $scope.alerts = [];
						    $scope.alerts.push({type: 'danger',
								msg: "Unable to add!"}); //msg: "Unable to add - " + response.data.meta.msg
						  });
					}
					
				};
			};
			
			$scope.initEditDepartment = function() {
				$scope.init();
				console.log("user id:", $stateParams.departmentId);
				var departmentId = $stateParams.departmentId;
				
				$scope.getDepartment = function(departmentId) {
					var baseDepartment = Restangular.one('departments', departmentId);
					baseDepartment.get().then(function(department) {
						console.log(department);
						$scope.department = department;
					}, function(rsp) {
						console.log(rsp);
					});
				};
				
				$scope.updateDepartment = function() {
					//var baseProducts = Restangular.all('products');
					var editDepartment = Restangular.copy($scope.department);

					console.log(editDepartment);
					editDepartment.put().then(function(data) {
						console.log(data);
						$scope.data = data;
						/*$scope.status = data.meta.status + ": "
								+ data.meta.msg;*/
						if (data.meta.status == 200) {
							$scope.alerts = [];
							$scope.alerts.push({type: 'success',
								msg: data.meta.msg});
						} else {
							$scope.alerts = [];
							$scope.alerts.push({type: 'danger',
								msg: data.meta.msg});
						}
					}, function(response) {
						console.log(response);
						$scope.alerts = [];
						$scope.alerts.push({type: 'danger',
							msg: "Unable to update!"});
					});
				};
				
				
				$scope.getDepartment(departmentId);
			};
});

