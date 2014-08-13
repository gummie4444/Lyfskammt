angular.module('viewCtr',[])

.controller ('viewCtr', function ($scope){
	
	//VIEW CTR
	//to handle the view changes

	$scope.loginActive = true;

	//toogle between login and signup
    $scope.$on('change', function(event, data) { 

    	$scope.loginActive = data;
	});

	$scope.$on('loggedIn', function (event, data) {
		$scope.isSettingsMenu = data;
	})

	$scope.isSettingsMenu = false;

	$scope.showSettingsMenu = function() {
		$scope.isSettingsMenu = !$scope.isSettingsMenu;
		console.log($scope.isSettingsMenu)
	}

	$scope.isCalibrate = false;

	$scope.showCalibrate = function() {
		$scope.isCalibrate = !$scope.isCalibrate;
	}

	$scope.isSettings = false;

	$scope.showSettings = function() {
		$scope.isSettings = !$scope.isSettings;
	}
});