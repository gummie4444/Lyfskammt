angular.module('Chart', ['highcharts-ng','ngDialog','ui.slider'])

.controller('myChart', function ($scope, Lyf,ngDialog,$log, $window) {

	// ========= //
	// VARIABLES //
	// ========= //

	$scope.graphTime = Date.now();
	$scope.drugs= [];
	$scope.index = 0;
	$scope.date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    $scope.isSelected= null;
    $scope.clock_time;

	// ========= //
	// FUNCTIONS //
	// ========= //

	$scope.fetch = function(lyf_id) {
		var current_lyf = JSON.parse(JSON.stringify(Lyf.getLyf(lyf_id))); // skítamix til að búa til afrit af hlut án þess að upphaflega breytan breytist líka
		for (i in current_lyf.data) {
			current_lyf.data[i][0] += $scope.graphTime;
		}
		$scope.drugs.push( {name: current_lyf.name, amount: current_lyf.amount, data: current_lyf.data, id: $scope.index, stringTime: $scope.stringTime, graphTime: $scope.graphTime, color: current_lyf.color, day: dateFormat($scope.graphTime, "dddd")});
		$scope.chartConfig.series.push( {name: current_lyf.name, amount: current_lyf.amount, data: current_lyf.data, id: $scope.index, stringTime: $scope.stringTime, graphTime: $scope.graphTime, color: current_lyf.color, day: dateFormat($scope.graphTime, "dddd")});
		$scope.isSelected = null;
	}
  
	$scope.removeDrug = function(drugnumber) {
		$scope.drugs.splice(drugnumber,1);
		var series = $scope.chartConfig.series;
		series.splice(drugnumber+1,1); // index in series is higher by 1 drug because of the sum graph
	}

	$scope.createEmptySumGraph = function () {
    	var sumGraph = JSON.parse(JSON.stringify(Lyf.createEmpty())); // cloning an empty drug
    	for (i in sumGraph) {
			sumGraph[i][0] += ($scope.date.valueOf()+1);
		}
		return sumGraph;	
    }

    $scope.updateSumGraph = function (drugs) {
    	$scope.chartConfig.series[0].data = $scope.createEmptySumGraph(); // always reset the sum graph to recalculate + draw
    	if ($scope.drugs.length > 1) { // only draw the sumGraph if there's more than one drug stored
			for (i in drugs) { // iterate through every drug
				for (j in drugs[i].data) { // iterate through every data point per drug
					for (k in $scope.chartConfig.series[0].data) // iterate through every data point in the "sum" curve
						if (Math.abs(drugs[i].data[j][0] - $scope.chartConfig.series[0].data[k][0]) <= 900000) {// round every point on the drug graph to the nearest point on the sum curve (900000ms === 15 minutes)
							$scope.chartConfig.series[0].data[k][1] += drugs[i].data[j][1] // update the sum graph with values from the drug graphs
						}
				}
			}
		}
	}

	$scope.chartConfig = {
		options: {
			chart: {
				zoomType: 'x',
			},
			legend: {
				enabled: false
			},
			credits: {
				enabled: false
			},
			plotOptions: {
				series: {
					animation: false,
	            	enableMouseTracking: false,
	            	marker: {
	            		enabled: false
	            	}
	            }
        	},
        	scrollbar: {
        		enabled: true
        	},

		},
		series: [
		{
			data: $scope.createEmptySumGraph(),
			color: "black",
			zIndex: 1,
			lineWidth: 7,
			
		}
		],
		// ENABLE HIGHSTOCK TO USE THIS
		// scrollbar: {
		// 		enabled: true
		// 	},
		
		title: {
			text: dateFormat($scope.date, "dddd, mmmm dS")
		},
		xAxis: {
			plotLines: [{
				color: '#FFB508',
                width: 1,
                value: Date.now(),
            }],
			min : $scope.date.valueOf(),
			max : $scope.date.valueOf()+86400000, 
			type: 'datetime'
		},
		yAxis: {
			plotLines: [{
				color: '#78C983',
                width: 1,
                value: 5,
            }],
			min : 0,
			gridLineWidth: 0,
			minorGridLineWidth: 0,
			labels: {
				enabled: false
			},
			title: {
				enabled: false
			}
		}
	};

    $scope.setSelected = function (Selected) { //FUNCTION TO SET WHAT DRUG THE USER IS USING
    	if ($scope.isSelected === Selected) {
    		$scope.isSelected = null;
		}
    	else {
    		$scope.isSelected = Selected;
    	}
    };



    $scope.clickToOpen = function () {
    	$scope.index++; 

        ngDialog.open({ template: 'template.html',
        				scope:$scope

        				 });  
    };

	$scope.moveDay = function (direction) {
		$scope.isSelected = null;
		if (direction === "left") {
			$scope.date = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate()-1);
		}
		else {
			$scope.date = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate()+1);
		};
		$scope.chartConfig.title.text = dateFormat($scope.date, "dddd, mmmm dS"); // update the date at top
		$scope.chartConfig.xAxis.min = $scope.date.valueOf(); // update the leftmost x-value
		$scope.chartConfig.xAxis.max = $scope.date.valueOf()+86400000; // update the rightmost x-value

		$scope.updateSumGraph($scope.drugs); // show the updated sum graph

		var time_split = $scope.stringTime.split(":");

		$scope.graphTime = Date.UTC($scope.date.getFullYear(),$scope.date.getMonth(),$scope.date.getDate(),time_split[0],time_split[1]);
	};


	// WATCH/UPDATE FUNCTIONS //
	
	$scope.$watch('drugs', function(newValues) {
			$scope.updateSumGraph(newValues)
			$scope.chartConfig.yAxis.plotLines = [{
									color: '#78C983',
					                width: 1,
					                value: $scope.drugs.length*3,
					            }]
	}, true);

	//Watch the time-slider
	$scope.$watch('clock_time', function (newValue, oldValue) {
        //do something
        var d = new Date();
        if(typeof newValue !== 'undefined'){
        	var res = newValue.split(":");
	      
	        $scope.graphTime = Date.UTC($scope.date.getFullYear(),$scope.date.getMonth(),$scope.date.getDate(),res[0],res[1]);
	        $scope.stringTime = newValue;
	        var test = new Date($scope.graphTime)  
   		 }
	    else {
	    	$scope.graphTime = Date.now();
	    	$scope.stringTime = $scope.prenta(d.getMinutes(), d.getHours());
	    }
    });

    $scope.$watch('graphTime', function(newValue) {
    	for (i in $scope.chartConfig.series) {
    		if ($scope.isSelected === $scope.chartConfig.series[i].id) { // find the drug with matching id
    			for (j in $scope.chartConfig.series[i].data) { // loop through its every data point
    				$scope.chartConfig.series[i].data[j][0] += ($scope.graphTime - $scope.chartConfig.series[i].graphTime);	// update its x component with the offset between its graphTime and desired time
    			}
    			var d = new Date($scope.graphTime);
    			$scope.chartConfig.series[i].graphTime = $scope.graphTime; // update the graph's graphTime
    			$scope.chartConfig.series[i].stringTime = $scope.prenta(d.getMinutes(), d.getHours()) // update the graph's stringTime
    			$scope.chartConfig.series[i].day = dateFormat($scope.graphTime, "dddd")
    			$scope.drugs[i-1] = $scope.chartConfig.series[i] // copy the graph to the drugs array
    		}
    	}
    });

    $scope.$watch('isSelected', function(newValue) {
    	if (newValue === null) {
    		for (i in $scope.chartConfig.series) {
				$scope.chartConfig.series[i].dashStyle = false;
			}
    	}
		else {
			for (i in $scope.chartConfig.series) {
				if ($scope.isSelected === $scope.chartConfig.series[i].id) {
					$scope.chartConfig.series[i].dashStyle = 'shortdash';

				}
				else {
					$scope.chartConfig.series[i].dashStyle = false
				}
			}
    	}
    });

    $scope.prenta = function(minutes,hours){
		if (hours.toString().length == 1){
			hours = '0' + hours;
		}
		if (minutes.toString().length== 1){
			 minutes = '0' + minutes;
		}
		return hours + ":" + minutes;
	};

    $scope.$on('heightChange', function(value) {
    	var container = document.getElementById("drug-chart");
    	var ang_container = angular.element(container);
    	$scope.chartConfig.options.chart.height = ang_container.height()
    });
});