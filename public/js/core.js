
lyfApp = angular.module('lyfskammtapp', [ 'lyfService', 'Chart', 'chart-resize', 'ngTouch','ngRoute','login','userService']);


lyfApp.config(['$locationProvider', '$routeProvider', 
  function($location, $routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'loginForm.html',
            controller:'loginCtr'

        }).
        when('/login', {
            templateUrl: 'loginForm.html',
            controller: 'loginCtr'
        }).
        when('/signup', {
            templateUrl: 'signupForm.html'
        }).
        when('/profile/:user', {
            templateUrl: 'profile.html',
            controller: 'myChart',
            access: { requiredAuthentication: true }
        }).
        
        otherwise({
            redirectTo: '/'
        });
}]);


        
        
        
