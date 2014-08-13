angular.module('login',['password-dir','ngFocus-dir','unique-dir'])

.controller ('loginCtr', function ($q,$scope,$log,userService,$location,authService,$window,Lyf){



	// ========= //
	// VARIABLES //
	// ========= //
	$scope.login = {};
	$scope.signup = {};
	$scope.users= [];
	$scope.login.error = false;
	$scope.login.errorValue = 0;

	Lyf.getUsers()
		.success(function(data)
		{
			$scope.users = data;
		
		});
	

	
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
					console.log(returnMsg);

					//RANGT NOTENDANAFN
					if (returnMsg.answer == 1){
						$scope.login.error = true;
						$scope.login.errorValue = 1;
						$window.sessionStorage.removeItem('token');
					}
					//RANGT LYKILORÐ FYRIR RÉTT NOTENDANAFN
					else if(returnMsg.answer == 2){
						$scope.login.error = true;
						$scope.login.errorValue = 2;
						console.log("Rangt lykilorð fyrir" + $scope.login.username);
						$window.sessionStorage.removeItem('token');
					}
					
					//komst inn
					if(returnMsg.answer == undefined ){
						$scope.$emit('loggedIn', false)
						authService.isAuthenticated = true;
						$scope.login.error = false;
						$window.sessionStorage.token = returnMsg.token;
						$location.path("/profile");
					}

				}).error(function(status,data){

					//GERA EITTHVAÐ ÞVÍ ÞAÐ VAR VILLA

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
		
		
    if ($scope.userSignup.$valid) {
      // Submit as normal

      	userService.signUp($scope.signup).success(function(returnMsg){
      		//BJÓ TIL USER
      		if(returnMsg.answer == 1){
				$location.path("/login");
				$scope.signUpChange(true);
			}
			//username is taken
			if(returnMsg.answer == 2){

			}
		}).error (function(status,data){
			//SERVER VILLA
			console.log(status);
			console.log(data);
		});
	}
		
	
     else {
      	// don't submit the form because there is somthing wrong
		console.log("eitthvad for urskeydis")
    }
};
  	

});