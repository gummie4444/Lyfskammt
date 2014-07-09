angular.module('Chart', ['chartjs-directive'])

.controller('myChart', function ($scope) {
	
	$scope.lyf = [ 
		{ name : "Lyf 1", 
		  data : [2,5,0,6,1,3,8]
		},  
		{ name : "Lyf 2", 
		  data : [8,0,3,4,6,4,2]
		},  
		{ name : "Lyf 3", 
		  data : [3,1,6,0,8,7,1]
		}];	
		
	$scope.options = {
		datasetFill : false
	};
	
	$scope.chosen_lyf = $scope.lyf[0];
	
	$scope.update = function() {
		$scope.generateData();
	}
	
	$scope.generateData = function(){
        var data = {
          labels : ["12","13","14","15","16","17","18"],
          datasets : [
            {
              fillColor : "rgba(220,220,220,0.5)",
              strokeColor : "rgba(220,220,220,1)",
              pointColor : "rgba(220,220,220,1)",
              pointStrokeColor : "#fff",
              data : $scope.chosen_lyf.data
            }
          ]
        };
        $scope.myChart = {"data": data, "options": $scope.options };
      };
	  
	  $scope.generateData();
	  
	  
});