
lyfApp = angular.module('lyfskammtapp', [ 'lyfService', 'Chart', 'chart-resize', 'ngTouch','ngRoute','login','userService','authService','TokenInterceptor','viewCtr', 'angularSlideables']);


lyfApp.config(['$locationProvider', '$routeProvider', 
  function($location, $routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'signupForm.html',
            controller: 'loginCtr'
        }).
        when('/login', {
            templateUrl: 'loginForm.html',
            controller: 'loginCtr'
        }).
        when('/signup', {
            templateUrl: 'signupForm.html',
            controller: 'loginCtr'
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

lyfApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});

lyfApp.run(function($rootScope, $location, $window, authService) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
        //redirect only if both isAuthenticated is false and no token is set
        if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication 
            && !authService.isAuthenticated && !$window.sessionStorage.token ) {

            $location.path("/login");
        }
    });
});


        
        
        
