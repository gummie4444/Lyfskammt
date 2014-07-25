angular.module('Chart', ['highcharts-ng','ngDialog','ui.slider'])

.controller('myChart', function ($scope, Lyf,ngDialog,$log, $window,$http) {

	// ========= //
	// VARIABLES //
	// ========= //
	$scope.graphTime = moment().valueOf();

	//TODO -----na i upphafs drugfylki



	$scope.drugs= {};


	//Load the drugs from database

	Lyf.get()
			.success(function(data) {
				$scope.drugs = data;
				for (var i in $scope.drugs) {
					$scope.chartConfig.series.push($scope.drugs[i]);
					if (!moment($scope.drugs[i].date).isSame($scope.date)) { // GAMALT: if (String($scope.drugs[i].date) !== String($scope.date)) {
						$scope.drugs[i].show = false;
					}
					else {
						$scope.drugs[i].show = true;
					}
				}
				console.log($scope.drugs)
			});


				
	$scope.index = 0;
	$scope.date = moment({y: moment().year(), M: moment().month(), d:moment().date()})
    $scope.isSelected= null;
    $scope.clock_time;
	$scope.before;
	$scope.after;

	

	


  

	// ========= //
	// FUNCTIONS //
	// ========= //


	// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
	$scope.createTodo = function(drug) {

		// validate the formData to make sure that something is there
		// if form is empty, nothing will happen
		// if ($scope.drugs.length != 0) {
		// 	for (var i in $scope.drugs) {
		// 	// call the create function from our service (returns a promise object)
		// 	Lyf.create($scope.drugs[i])

		// 		// if successful creation, call our get function to get all the new todos
		// 		.success(function(data) {
					
					
		// 			$scope.drugs.push(data); // assign our new list of todos
		// 		});
		// 	}
		// }
		Lyf.create(drug)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.drugs.push(data); // assign our new list of todos
				});
	};

	$scope.deleteTodo = function(id) {
			Lyf.delete(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.todos = data; // assign our new list of todos
				});
		};


	$scope.fetch = function(lyf_id) {
		var current_lyf = JSON.parse(JSON.stringify(Lyf.getLyf(lyf_id))); // skítamix til að búa til afrit af hlut án þess að upphaflega breytan breytist líka
		for (i in current_lyf.data) {
			current_lyf.data[i][0] += $scope.graphTime;
		}
		var current_lyf_updated = {
			name: current_lyf.name, 
			amount: current_lyf.amount, 
			data: current_lyf.data, 
			visible: true,
			checked: true, 
			show: true, 
			date: $scope.date.format(), 
			id: $scope.index, stringTime: 
			$scope.stringTime, graphTime: 
			$scope.graphTime, 
			color: current_lyf.color, 
			day: moment($scope.graphTime).lang("is").format("ddd")
		}
		$scope.drugs.push(current_lyf_updated);
		$scope.chartConfig.series.push(current_lyf_updated);

		$scope.isSelected = null;	
		$scope.createTodo(current_lyf_updated);
	}
  
	$scope.removeDrug = function(drug_id) {
		// VARÚÐ: SKÍTAMIX
		for (var i in $scope.chartConfig.series) {
			// if ($scope.drugs[i].id === drug_id) {
			// 	$scope.drugs.splice(i,1)
			// }
			if ($scope.chartConfig.series[i].id === drug_id) {
				var series = $scope.chartConfig.series;
				series.splice(i,1); // index in series is higher by 1 drug because of the sum graph
			}
		}

		for (var i in $scope.drugs) {
			if ($scope.drugs[i].id === drug_id) {
				$scope.drugs.splice(i,1)
			}
		}
		$scope.deleteTodo(drug_id)
	}

	$scope.createEmptySumGraph = function () {
    	var sumGraph = JSON.parse(JSON.stringify(Lyf.createEmpty())); // cloning an empty drug
    	for (i in sumGraph) {
			sumGraph[i][0] += ($scope.date.valueOf()+21600000+1);
		}
		return sumGraph;	
    }

    $scope.updateSumGraph = function (drugs) {
    	$scope.chartConfig.series[0].data = $scope.createEmptySumGraph(); // always reset the sum graph to recalculate + draw
    	if ($scope.drugs.length > 1) { // only draw the sumGraph if there's more than one drug stored
			for (i in drugs) { // iterate through every drug
				if (drugs[i].visible === true) {
					for (j in drugs[i].data) { // iterate through every data point per drug
						for (k in $scope.chartConfig.series[0].data) // iterate through every data point in the "sum" curve
							if (Math.abs(drugs[i].data[j][0] - $scope.chartConfig.series[0].data[k][0]) <= 900000) {// round every point on the drug graph to the nearest point on the sum curve (900000ms === 15 minutes)
								$scope.chartConfig.series[0].data[k][1] += drugs[i].data[j][1] // update the sum graph with values from the drug graphs
							}
					}
				}
			}
		}
	}

	$scope.chartConfig = {
		options: {
			chart: {
				animation: false
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
			text: moment($scope.date).lang("is").format("dddd Do MMMM")
		},
		xAxis: {
			plotLines: [{
				color: '#FFB508',
                width: 1,
                value: moment().valueOf(),
            }],
			min : $scope.date.valueOf()+21600000,
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
    	$scope.index = moment().valueOf()*Math.random()

        ngDialog.open({ template: 'template.html',
        				scope:$scope

        				 });  
    };

	$scope.moveDay = function (direction) {
		$scope.isSelected = null;
		if (direction === "left") {
			$scope.date.subtract('d', 1);
		}
		else {
			$scope.date.add('d', 1);
		};
		$scope.chartConfig.title.text = moment($scope.date).lang("is").format("dddd Do MMMM"); // update the date at top
		$scope.chartConfig.xAxis.min = $scope.date.valueOf()+21600000; // update the leftmost x-value
		$scope.chartConfig.xAxis.max = $scope.date.valueOf()+86400000; // update the rightmost x-value

		$scope.updateSumGraph($scope.chartConfig.series); // show the updated sum graph

		var time_split = $scope.stringTime.split(":");

		$scope.graphTime = moment({y: $scope.date.year(), M: $scope.date.month(), d: $scope.date.date(), h: time_split[0], m: time_split[1]}).valueOf()

		for (var i in $scope.drugs) {
			if (!moment($scope.drugs[i].date).isSame($scope.date)) { // GAMALT: if (String($scope.drugs[i].date) !== String($scope.date)) {
				$scope.drugs[i].show = false;
			}
			else {
				$scope.drugs[i].show = true;
			}
		}
	};

	// $scope.swipeGraph = function(desc) {
	// 	if (desc === 'left') 
	// 		$scope.moveDay('left')
	// 	else 
	// 		$scope.moveDay('right')
	// };

	$scope.clickCheckbox = function (id, checked) {

		for (var i in $scope.chartConfig.series) {
			if ($scope.chartConfig.series[i].id === id) {
				if (checked === true) {
					$scope.chartConfig.series[i].visible = true;
				}
				else {
					$scope.chartConfig.series[i].visible = false;
				}
			}
		}
		// if (checked === true) {
		// 	for (var i in $scope.drugs) {
		// 		if ($scope.drugs[i].id === id) {
		// 			$scope.chartConfig.series.push($scope.drugs[i])
		// 		}
		// 	}
		// }
		// else {
		// 	for (var i in $scope.chartConfig.series) {
		// 		if ($scope.chartConfig.series[i].id === id) {
		// 				$scope.chartConfig.series.splice(i,1);

		// 		}
		// 	}
		// }
		// console.log("drugs: ",$scope.drugs)
		// console.log("chart: ",$scope.chartConfig.series)
	}

	// WATCH/UPDATE FUNCTIONS //
	
	$scope.$watch('chartConfig.series', function(newValues) {
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
        var d = moment();
        if(typeof newValue !== 'undefined'){
        	var res = newValue.split(":");
	      	
	      	$scope.graphTime = moment({y: $scope.date.year(), M: $scope.date.month(), d: $scope.date.date(), h: res[0], m: res[1]}).valueOf()
	        // $scope.graphTime = Date.UTC($scope.date.getFullYear(),$scope.date.getMonth(),$scope.date.getDate(),res[0],res[1]);
	        $scope.stringTime = newValue;
   		 }
	    else {
	    	$scope.graphTime = moment().valueOf();
	    	$scope.stringTime = $scope.prenta(d.minutes(), d.hours());
	    }
    });

    $scope.$watch('graphTime', function(newValue) {
    	for (i in $scope.chartConfig.series) {
    		if ($scope.isSelected === $scope.chartConfig.series[i].id) { // find the drug with matching id
    			for (j in $scope.chartConfig.series[i].data) { // loop through its every data point
    				$scope.chartConfig.series[i].data[j][0] += ($scope.graphTime - $scope.chartConfig.series[i].graphTime);	// update its x component with the offset between its graphTime and desired time
    			}
    			var d = moment($scope.graphTime);
    			$scope.chartConfig.series[i].graphTime = $scope.graphTime; // update the graph's graphTime
    			$scope.chartConfig.series[i].stringTime = $scope.prenta(d.minutes(), d.hours()) // update the graph's stringTime
    			$scope.chartConfig.series[i].day = moment($scope.graphTime).format("dddd")
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