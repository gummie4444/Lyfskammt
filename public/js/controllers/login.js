angular.module('login',[])

.controller ('loginCtr', function ($q,$scope,$log,userService,$location,authService,$window){

	// ========= //
	// VARIABLES //
	// ========= //
	$scope.login = {};
	$scope.signup = {};
	
	//FUNCTON for toogling between signup and login
	$scope.signUpChange = function(value){
		$scope.$emit('change',value);
	}

	//Function for the login submit
	//TODO BUILD A USER INTERFACE
	$scope.logInFunc = function(){
		
		if ($scope.login.username !== undefined && $scope.login.password !== undefined){
			//Senda inn upplýsingar í service
			userService.validateUser($scope.login)
				.success(function(returnMsg){
				
					authService.isAuthenticated = true;
					$window.sessionStorage.token = returnMsg.token;
					$location.path("/profile/" + $scope.login.username);

				}).error(function(status,data){

					$window.sessionStorage.removeItem('token');
					
				});
		}

	};

	//FUNCTION for loging out
	//put this into charts.js????????
	$scope.logOutFunc = function(){

		 if (authService.isAuthenticated) {
                authService.isAuthenticated = false;
                delete $window.sessionStorage.token;
                $location.path("/");
            }
	          
		   }

	//FUNCTION: that takes the submition and creates a user into the database
	//TODO: CREATE A USER INTERFACE
	$scope.signUpFunc = function(){

		userService.signUp($scope.signup).success(function(returnMsg){
			$location.path("/login");
		}).error (function(status,data){
			console.log(status);
			console.log(data);
		});
	}
		

});