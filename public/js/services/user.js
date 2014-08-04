angular.module('userService',[])


.service('userService', function($http){

return{

	validateUser:function(user){

		return $http.post('/api/users',user);
	}

	

}
	
});