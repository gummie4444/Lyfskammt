angular.module('viewCtr',[])

.controller ('viewCtr', function ($scope){
	
	//VIEW CTR
	//to handle the view changes

	$scope.loginActive = true;

	//toogle between login and signup
    $scope.$on('change', function(event, data) { 

    	$scope.loginActive = data;
	});

    $scope.menuDot = false;
	//toogle between login and signup
    $scope.$on('toogle', function(event, data) { 

    	$scope.menuDot = data;
	});







});