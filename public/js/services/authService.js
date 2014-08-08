angular.module('authService',[])

//FACTORY:
	/*

		Factory for handling the authentication of the user for the routes

	*/

.factory('authService', function() {
    var auth = {
        isAuthenticated: false
    
    }

    return auth;
});