angular.module('login',[])

.controller ('loginCtr', function ($scope,$log,userService,$location,authService,$window){


	$scope.login = {};
	$scope.signup = {};
	

	$scope.isValidated = "nei";

	$scope.senda = function(){
		
		userService.send($scope.login);
	}

	$scope.signUpChange = function(value){

		$scope.$emit('bla',value);
		console.log("hallo");


	}

	$scope.logInFunc = function(){
		console.log($scope.login);
		if ($scope.login.username !== undefined && $scope.login.password !== undefined){
			//Senda inn upplýsingar í service
			userService.validateUser($scope.login)
				.success(function(returnMsg){
					console.log(returnMsg);
					authService.isAuthenticated = true;

					 $window.sessionStorage.token = returnMsg.token;

					$scope.isValidate = returnMsg + " " + $scope.login.username;
					
					

					$location.path("/profile/" + $scope.login.username);

				}).error(function(status,data){


				

					 $window.sessionStorage.removeItem('token');
					$scope.isValidate = "Notandanafn eða lykilorð er ekki rétt!"
					console.log(status);
					console.log(data);
				});
		}

	};

	$scope.logOutFunc = function(){

		 if (authService.isAuthenticated) {
                authService.isAuthenticated = false;
                delete $window.sessionStorage.token;
                $location.path("/");
            }
	           /* if (authService.isAuthenticated) {
	            		
	                
	                userService.logout()
	                	.success(function(data) {
		                   authService.isAuthenticated = false;
		                    delete $window.sessionStorage.token;
		                    $location.path("/");
		                }).error(function(status, data) {
		                    console.log(status);
		                    console.log(data);
		                });
		            }
		            else {
		                $location.path("/login");
		            }
		        }

		       */
		   }

	$scope.signUpFunc = function(){

		
				userService.signUp($scope.signup).success(function(returnMsg){
					console.log("signup: " + returnMsg);
					$location.path("/login");
				}).error (function(status,data){
					console.log(status);
					console.log(data);
				});
			}
		

});