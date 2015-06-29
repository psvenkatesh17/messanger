'use strict';

angular.module('instagramApp')
  .controller('LoginCtrl', function ($scope, Auth, $location,Restangular,localStorageService) {
    $scope.init = function() {
      $scope.user = {};
      $scope.errors = {};  
      $scope.alerts = [];
      $scope.closeAlert = function(index) {        
        $scope.alerts.splice(index, 1);
      };  
    };
    
    $scope.initLogin = function() {
      $scope.init();                 
      $scope.signIn = function(){              
          Auth.login($scope.user, function(rsp){           
            $scope.user = {};
            $scope.alerts = [];
            $scope.alerts.push({type: 'danger',
                msg: rsp.data.meta.msg}); 
          });            
      };
    };

  });
