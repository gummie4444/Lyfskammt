angular.module('Chart', ['highcharts-ng','ngDialog','ui.slider'])

.controller('myChart', function ($scope, Lyf,ngDialog,$log) {
  

	
	$scope.fetch = function(lyf_id) {
		var current_lyf = Lyf.getLyf(lyf_id);
		for (i in current_lyf.data) {
			current_lyf.data[i][0] += $scope.graphTime;
		}
		console.log(Date($scope.graphTime))
		$scope.drugs.push( {name: current_lyf.name, amount: current_lyf.amount, data: current_lyf.data, id: $scope.index, stringTime: $scope.stringTime, graphTime: $scope.graphTime, color: current_lyf.color});
		$scope.chartConfig.series.push(current_lyf)
	}
  
	$scope.removeDrug = function(drugnumber) {
		$scope.drugs.splice(drugnumber,1);
		var series = $scope.chartConfig.series;
		series.splice(drugnumber+1,1);
	}

	$scope.graphTime = Date.now();


	$scope.drugs= [
	
				
		];
  
  	$scope.index = 0;

    $scope.clickToOpen = function () {
    	$scope.index++; 

        ngDialog.open({ template: 'template.html',
        				scope:$scope

        				 });  
    };

	

	$scope.chartConfig = {
		options: {
			chart: {
				zoomType: 'x',
				
			},
			legend: {
				enabled: false
			}
			
		},
		series: [
		{
			data: Lyf.createEmpty(),
			color: "black",
			zIndex: 1,
			lineWidth: 12
		}
		],
		title: {
			text: 'Lyf'
		},
		xAxis: {
			min : Date.now()-21600000,
			max : Date.now()+64800000, 
			type: 'datetime'
			
		},
		yAxis: {
			min : 0,
			gridLineWidth: 0,
			minorGridLineWidth: 0
		},
		loading: false
	}



	
	$scope.$watch('drugs', function(newValues) {
		$scope.chartConfig.series[0].data = Lyf.createEmpty(); // always reset the "total" curve to recalculate + draw
		for (i in newValues) {
			for (j=0; j<48; j++) {
				$scope.chartConfig.series[0].data[j][1] += newValues[i].data[j][1] // add upp the y component of every graph to draw the "total" curve
			}
		}
		console.log($scope.drugs)
	}, true)

	//Watch the time-slider

	$scope.$watch('a.b', function (newValue, oldValue) {
        
        //do something
        var d = new Date();
        if(typeof newValue !== 'undefined'){
        
        
        


         var res = newValue.split(":");
      

         

        $scope.graphTime = Date.UTC(d.getFullYear(),d.getMonth(),d.getDate(),res[0],res[1]);
        $scope.stringTime = newValue;
        var test = new Date($scope.graphTime)


        
    }
    else {
    	$scope.graphTime = Date.now();
    	$scope.stringTime = $scope.prenta(d.getMinutes(), d.getHours())
    }

       

    });

    $scope.prenta = function(minutes,hours){
	if(hours.toString().length == 1){
		hours = '0' + hours;
	}
	if(minutes.toString().length== 1){
		 minutes = '0' + minutes;
		}

	return hours + ":" + minutes;
};

    //FUNCTION TO SET WHAT DRUG THE USER IS USING

    $scope.isSelected= null;
    $scope.setSelected = function (Selected) {
    	$scope.idSelected = Selected;
    };
});