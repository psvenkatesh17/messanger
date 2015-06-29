'use strict';

angular.module('instagramApp').controller('FriendsCtrl',
	 	function($scope, Restangular, $modal, dialogs, $stateParams, Auth) {
			$scope.init = function() {				
				$scope.alerts = [];
				$scope.closeAlert = function(index) {					
					$scope.alerts.splice(index, 1);
				};
			};
		
			$scope.initFriends = function() {
				$scope.init();		
				var filter = {};
				filter.user = "558a4277e4dd3c201808081f";
				var baseFriends = Restangular.all('friends');
				baseFriends.getList(filter).then(function (data) {
					$scope.friends = [];
					for(var i = 0 ; i < data.length ; i++) {
						$scope.friends.push(data[i]);
					}
					console.log("Friends:", $scope.friends);
				});		

				$scope.removeFriend = function(friendObj) {
					console.log("friendObj:", friendObj);
					var friendToDelete = friendObj;
					friendToDelete.remove({_id:friendToDelete._id}).then(function (rsp) {
						console.log("Delete rsp:",rsp);
						if(rsp.meta.status == 200) {
							console.log("alerts");
							$scope.alerts = [];
							$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
							$scope.initFriends();
						} else {
							$scope.alerts = [];
							$scope.alerts.push({type: 'danger', msg: rsp.meta.msg});
						}
					});
				};

				$scope.message = function() {
					$modal.open({
						templateUrl: 'message.html',
						controller: 'FriendsCtrl'
					});
				};
			};
			
			

			$scope.initCreateFriend = function() {
				console.log("create friends");

				$scope.gridOptions = {
					data : 'users',
					enablePaging : true,
					showFooter : true,
					totalServerItems : 'totalServerItems',
					pagingOptions : $scope.pagingOptions,
					filterOptions : $scope.filterOptions,
					selectedItems : $scope.mySelection,
					keepLastSelected: false,
					multiSelect: Auth.isAdmin() || Auth.isManager(),
					selectWithCheckboxOnly : Auth.isAdmin() || Auth.isManager(),
					showSelectionCheckbox : Auth.isAdmin() || Auth.isManager()
				};

				$scope.gridOptions.columnDefs = [
				{
					field : 'name',
					displayName : 'Branch Name'
				},
				{
					field : 'email',
					displayName : 'Email'
				},
				{
					field : 'mobile',
					displayName : 'Mobile'
				},
				{
					field : 'address',
					displayName : 'Address'
				},
				{
					field : '',
					displayName : 'Actions',
					sortable : false,
					cellTemplate : '<div class="text-center"><div class="btn-group btn-group-xs">'
							+ '<a href="javascript:void(0)"'
							+ ' ng-click="addFriend(row)" data-toggle="tooltip" title=""'
							+ ' class="btn btn-sm btn-success" data-original-title="Add"><i>Add</i></a></div></div>'
				} ];

				$scope.addFriend = function(row) {
					console.log(row.entity);
					var filter = {};
					filter.user = "558a4277e4dd3c201808081f";
					filter.friend = row.entity._id;
					var baseFriend = Restangular.all('friends');
					baseFriend.post(filter).then(function (data) {
						console.log("DATA:", data);
						if(data.meta.status == 201) {
							$scope.alerts = [];
							$scope.alerts.push({type: 'success', msg: "Friend Added Successfully"});
						}
					});
				};

				$scope.searchFriend = function() {
					console.log("Value:", $scope.email);
					var filter = {};
					filter.email = $scope.email;
					var baseUsers = Restangular.all('users');
					baseUsers.getList(filter).then(function (data) {
						console.log("User:", data[0]);
						$scope.users = data;
					});
					
				};
			};

});


