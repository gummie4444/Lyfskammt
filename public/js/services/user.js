angular.module('userService',[])

//SERVICE:
	/*

		To handle api calls for the user login/signout/logout

	*/

.service('userService', function($http){

return{

	validateUser:function(user){

		return $http.post('/api/users',user);
	},

	signUp:function(user){
		return $http.post('/api/users/register',user);
	}

}
	
});