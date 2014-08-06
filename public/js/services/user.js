angular.module('userService',[])


.service('userService', function($http){

return{

	validateUser:function(user){

		return $http.post('/api/users',user);
	},

	/* skoða
	logout:function(){
		
		return $http.get('/api/users/logOut');
	},*/

	signUp:function(user){
		return $http.post('/api/users/register',user);
	}

	

}
	
});