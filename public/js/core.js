
lyfApp = angular.module('lyfskammtapp', [ 'lyfService', 'Chart','ngTouch','ngRoute','login','userService','authService','TokenInterceptor','viewCtr', 'ngAnimate']);

//routing
lyfApp.config(['$locationProvider', '$routeProvider', 
  function($location, $routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'welcomeScreen.html',
            controller: 'loginCtr'
        }).
        when('/login', {
            templateUrl: 'welcomeScreen.html',
            controller: 'loginCtr'
        }).
        when('/signup', {
            templateUrl: 'welcomeScreen.html',
            controller: 'loginCtr'
        }).
        when('/profile', {
            templateUrl: 'profile.html',
            controller: 'myChart',
            access: { requiredAuthentication: true }
        }).
        
        otherwise({
            redirectTo: '/'
        });
}]);

//Front end user validation
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
        if ($window.sessionStorage.token != null ) {
            $location.path("/profile")
        }
    });
});
