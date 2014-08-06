angular.module('authService',[])


.factory('authService', function() {
    var auth = {
        isAuthenticated: false,
        isAdmin: false
    }

    return auth;
});