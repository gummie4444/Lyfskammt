angular.module('viewCtr',[])

.controller ('viewCtr', function ($scope){
	

	$scope.loginActive = true;



    $scope.$on('bla', function(event, data) { 


    	console.log(data);
    	$scope.loginActive = data;
    	

});




});