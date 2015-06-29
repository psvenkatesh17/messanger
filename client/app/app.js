'use strict';
angular.module('instagramApp', ['ngAnimate', 'ngCookies', 'ngResource', 'ngSanitize', 
    'ui.router', 'ui.bootstrap', 'ui.bootstrap.datetimepicker', 'ui.utils', 'ui.load', 
    'ui.jq', 'restangular', 'ngGrid', 'oc.lazyLoad', 'LocalStorageModule', 'dialogs.main', 
    'dialogs.default-translations', 'angular-flot', 'ngBootstrap', 'angularMoment', 
    'pascalprecht.translate', 'ngStorage']).config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, RestangularProvider, $injector, dialogsProvider) {
    $stateProvider.state('app', {
        templateUrl: 'app.html',
        abstract: true,
        resolve: {
            user: ['Auth',
                function(Auth) {
                    console.log("resolving CurrentUser");
                    return Auth.getCurrentUser();
                }
            ]
        }
    });
    dialogsProvider.useBackdrop('static');
    dialogsProvider.useEscClose(true);
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
    RestangularProvider.setBaseUrl('/api');
    RestangularProvider.setRestangularFields({
        id: "_id"
    });
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {        
        var usersPattern = /\/api\/users\/(.+)/g;

        var extractedData = {};
        console.log(operation);
        console.log(url);                        

        // auth Url's
        if (url === '/api/auth/login') {
            if (operation === "post") {
                extractedData = data.response;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }
        if (url === '/api/auth/refresh-token') {
            if (operation === "post") {
                extractedData = data.response;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }
        if (url === '/api/auth/logout') {
            if (operation === "post") {
                extractedData = data.response;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

        // Friends Url's
        if (url === '/api/friends') {
            if (operation === "getList") {                
                extractedData = data.response.friends;
                extractedData.total = data.response.total;
            } else if (operation === "get") {
                extractedData = data.response.friend;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

        // Messages Url's
        if (url === '/api/messages') {
            if (operation === "getList") {                
                extractedData = data.response.messages;
                extractedData.total = data.response.total;
            } else if (operation === "get") {
                extractedData = data.response.message;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

        // Message Stats Url's
        if(url === '/api/apartments/stats') { 
            if (operation === "get") { 
                // .. and handle the data and meta data                      
                extractedData = data.response.stats;                         
            } 
            extractedData.meta = data.meta; 
            return extractedData; 
        }
    
        // User Url's
        if (url === '/api/users/me') {
            if (operation === "get") {
                extractedData = data.response;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }
        if (url === '/api/users') {
            extractedData = {};
            if (operation === "getList") {                
                extractedData = data.response.users;
                extractedData.total = data.response.total;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }
        if (url === '/api/users/all') {
            if (operation === "getList") {               
                extractedData = data.response.users;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }
        if (usersPattern.test(url)) {
            if (operation === "get") {                
                extractedData = data.response.user;                
            }
            extractedData.meta = data.meta;
            return extractedData;
        }  
        return data;
    });
}).factory('authInterceptor', function($rootScope, $q, localStorageService, $location) {
    return {
        // Add authorization token to headers
        request: function(config) {
            config.headers = config.headers || {};
            if (localStorageService.get('access_token')) {
                config.headers.Authorization = 'Bearer ' + localStorageService.get('access_token');
            }
            return config;
        }
    };
})
// Intercept 401s response
.run(function($rootScope, $urlRouter, $location, Auth, Restangular, localStorageService, $injector, $q, $http, $state) {
    Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
        
        if (response.status === 401 && Auth.getmaxTries() < 3) {
            console.log("401 response error");
            if(response.config.url == '/api/auth/login'){                                
                return true;
            }
            Auth.setMaxTries();
            Auth.refreshToken().then(function(data) {
                Auth.resetTries();
                $http(response.config).then(responseHandler, deferred.reject);
            });
            return false;
        }        
        return true;
    });
    // Redirect to login if route requires auth and you're not logged in    
    $rootScope.$on('$stateChangeStart', function(event, next) {
        console.log("OnStateChange"); 
        console.log("next.authenticate", next.authenticate);
        console.log("isLoggedIn", Auth.isLoggedIn());        
        if (Auth.getCurrentUser().then) {
            Auth.getCurrentUser().then(function(user) {
                if (next.authenticate && !Auth.isLoggedIn()) {
                    //$location.path('/login');
                } else if ((next.role) && next.role != Auth.getCurrentUser().role) {                    
                    $location.path('/unauthorized');
                }
            });
            return;
        }        
        if (next.authenticate && !Auth.isLoggedIn()) {
           // $location.path('/login');
        }
    });
});