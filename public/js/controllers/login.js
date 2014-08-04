angular.module('login',[])

.controller ('loginCtr', function ($scope,$log,userService,$location){


$scope.login = {};

$scope.isValidated = "nei";

$scope.senda = function(){
	
	userService.send($scope.login);
}

$scope.submitLoginForm= function(){
	console.log($scope.login);
	if ($scope.login.username !== undefined && $scope.login.password !== undefined){
		//Senda inn upplýsingar í service
		userService.validateUser($scope.login)
			.success(function(returnMsg){
				console.log(returnMsg);
				$scope.isValidate = returnMsg + " " + $scope.login.username;
				$location.path("/profile/" + $scope.login.username);
			}).error(function(status,data){

				$scope.isValidate = "Notandanafn eða lykilorð er ekki rétt!"
				console.log(status);
				console.log(data);
			});
	}

};
});