angular.module('viewCtr',[])

.controller ('viewCtr', function ($scope){
	
	//VIEW CTR
	//to handle the view changes

	$scope.loginActive = true;

	//toogle between login and signup
    $scope.$on('change', function(event, data) { 

    	$scope.loginActive = data;
	});




});