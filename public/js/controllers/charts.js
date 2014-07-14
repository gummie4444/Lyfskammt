angular.module('Chart', ['highcharts-ng','ngDialog','ui.slider'])

.controller('myChart', function ($scope, Lyf,ngDialog,$log) {
  

	
	$scope.fetch = function(lyf_id) {
		$scope.drugs.push( {name: Lyf.getLyf(lyf_id).name, amount: Lyf.getLyf(lyf_id).amount, data: Lyf.getLyf(lyf_id).data, id: $scope.index, time: 5, color: Lyf.getLyf(lyf_id).color});
		$scope.chartConfig.series.push(Lyf.getLyf(lyf_id))
	}
  
	$scope.removeDrug = function(drugnumber) {
		$scope.drugs.splice(drugnumber,1);
		var series = $scope.chartConfig.series;
		series.splice(drugnumber+1,1);
	}


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
	}, true)
});