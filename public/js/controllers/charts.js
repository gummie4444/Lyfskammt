angular.module('Chart', ['highcharts-ng','ngDialog','ui.slider', 'ngTouch',  'chart-resize', 'mobiscroll-dir'])

.controller('myChart', function ($scope, Lyf,ngDialog,$log, $window,$http, $timeout, authService, $location) {

	//set the acces_token
	var access_token = JSON.stringify({'access_token':$window.sessionStorage.token});

	
	// ========= //
	// VARIABLES //
	// ========= //
	$scope.loading = true;
	$scope.graphTime = moment({y: moment().year(), M: moment().month(), d:moment().date(), h:moment().hour(), m:moment().minute()}).valueOf();
	$scope.drugs= {};
	$scope.index = 0;
	$scope.date = moment({y: moment().year(), M: moment().month(), d:moment().date()})
    $scope.isSelected= null;
    $scope.clock_time = moment().format('HH'+':'+'mm');
    $scope.clock_display;

	
	
	//Load the drug_data from the database, specificly from the user
	//SKOÐA FÆRA Í LYF?????
	Lyf.updateDrugData()
		.success(function(data)
		{
			$scope.drug_data = data;

		});

	//Load the drugs from the database, specificly from the user

	Lyf.get()
			.success(function(data) {
				$scope.loading = false;
				$scope.chartConfig.loading = false;
				$scope.drugs = data;
				for (var i in $scope.drugs) {
					$scope.chartConfig.series.push($scope.drugs[i]);
					if (!moment($scope.drugs[i].date).isSame($scope.date)) {
						$scope.drugs[i].show = false;
					}
					else {
						$scope.drugs[i].show = true;
					}
				}
				$scope.updateSumGraph($scope.chartConfig.series)
			});


    // config for timepicker (scroller)
    $scope.mobiscrollConfig = {
    			theme: 'ios7',
                display: 'inline',
                mode: 'scroller',
                type: 'time',
                minWidth: angular.element(document.getElementById('timepicker')).width()/7,
                height: angular.element(document.getElementById('timepicker')).height()/5.65,
                timeFormat: 'HH:ii',
                timeWheels:'HHii',
                layout: 'liquid',
                headerText: false,
        }


    // config for timepicker (slider)
    $scope.slider = {
		options: {
			min: 0,
			max: 1435,
			step:5,
			value: moment().minutes()+moment().hours()*60,
			stop: function (event, ui) {
				for (i in $scope.chartConfig.series) {
    				if ($scope.isSelected === $scope.chartConfig.series[i].id) { // find the drug with matching id
    					$scope.createDrug($scope.chartConfig.series[i]);
    				}
    			}
			},
			slide: function (event, ui) { 
				var hours = Math.floor(ui.value / 60);
				var minutes = ui.value - (hours * 60);

				if(hours.toString().length == 1) hours = '0' + hours;
				if(minutes.toString().length == 1) minutes = '0' + minutes;

				var input = $("#prufadot");

				$scope.updateSumGraph($scope.chartConfig.series)
    	
    
		        input.val( hours+':'+minutes );
		        input.trigger('input');
			}
		}
    }


	// ========= //
	// FUNCTIONS //
	// ========= //


	// CREATE ==================================================================
	// Function for adding a drug to the database
	$scope.createDrug = function(drug) {

		Lyf.create(drug)
				.success(function(data) {
					$scope.drugs.push(data); // assign our new list of todos
					console.log("success!")
				});
	};

	//Functon for deleting a drug from the database
	$scope.deleteDrug = function(id) {
			Lyf.delete(id)
				.success(function(data) {
					$scope.loading = false;
					
				});
			$scope.updateSumGraph($scope.chartConfig.series)
		};

	//Functon thats called when we create a drug
	//It updates all the variable and calls the functions to send the info to the database
	$scope.fetch = function(lyf_id) {
		var current_lyf = JSON.parse( JSON.stringify($scope.drug_data[lyf_id-1])); 
		for (i in current_lyf.data) {
			current_lyf.data[i][0] += (current_lyf.data[i][0]*300000 + $scope.graphTime);
		}
		var current_lyf_updated = {
			name: current_lyf.name, 
			amount: current_lyf.amount, 
			data: current_lyf.data, 
			visible: true,
			checked: true, 
			show: true, 
			date: $scope.date.format(), 
			id: $scope.index,
			stringTime:$scope.stringTime,
			graphTime: $scope.graphTime,
			duration : current_lyf.duration,
			statusStartTime: null,
			statusEndTime:null,
			color: current_lyf.color, 
			day: moment($scope.graphTime).lang("is").format("ddd"),
			current_user:""

		}
		$scope.drugs.push(current_lyf_updated);
		$scope.chartConfig.series.push(current_lyf_updated);
		$scope.isSelected = null;	
		$scope.createDrug(current_lyf_updated);
		$scope.updateSumGraph($scope.chartConfig.series)
		console.log($scope.drugs)
	}
  	
  	//Remove the drug locally from the view
	$scope.removeDrug = function(drug_id) {
	
		for (var i in $scope.chartConfig.series) {
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
		$scope.deleteDrug(drug_id)
		$scope.isSelected = null;
	}
	//Create a empty graph for the init of the graph
	$scope.createEmptySumGraph = function () {
    	var sumGraph = JSON.parse(JSON.stringify(Lyf.createEmpty())); // cloning an empty drug
    	for (i in sumGraph) {
			sumGraph[i][0] += ($scope.date.valueOf()+21600000); // offset 6 hours because we only show 06:00-24:00
		}
		return sumGraph;	
    }

    //Update the view of the graph
    $scope.updateSumGraph = function (drugs) {
    	$scope.chartConfig.series[0].data = $scope.createEmptySumGraph(); // always reset the sum graph to recalculate + draw
    	if ($scope.drugs.length > 1) { // only draw the sumGraph if there's more than one drug stored
			for (i in drugs) { // iterate through every drug
				if (drugs[i].visible === true) {
					for (j in drugs[i].data) { // iterate through every data point per drug
						for (k in $scope.chartConfig.series[0].data) // iterate through every data point in the "sum" curve
							if (Math.abs(drugs[i].data[j][0] - $scope.chartConfig.series[0].data[k][0]) <= 150000) {// round every point on the drug graph to the nearest point on the sum curve (15000ms === 2.5 minutes)
								$scope.chartConfig.series[0].data[k][1] += drugs[i].data[j][1] // update the sum graph with values from the drug graphs
							}
					}
				}
			}
		}
	}

	// variables to initialize height of chart
	var container = document.getElementById("drug-chart");
	var ang_container = angular.element(container);

	$scope.chartConfig = {
		options: {
			chart: {
				animation: false,
				height: ang_container.height()*1.02796

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
		loading: true,
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
				color: '#bdc3c7',
                width: 3,
                value: 2500,
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

	//Function to set what drug the user is using
    $scope.setSelected = function (Selected) { 
    	if ($scope.isSelected === Selected) {
    		$scope.save(Selected);
		}
    	else {
    		$scope.isSelected = Selected;
    	}

    	if (Selected === null) {
    		for (i in $scope.chartConfig.series) {
				$scope.chartConfig.series[i].dashStyle = false;
			}
    	}
		else {
			for (i in $scope.chartConfig.series) {
				if ($scope.isSelected === $scope.chartConfig.series[i].id) {
					$scope.chartConfig.series[i].dashStyle = 'shortdash';
					$scope.clock_time = $scope.chartConfig.series[i].stringTime;

				}
				else {
					$scope.chartConfig.series[i].dashStyle = false

				}
			}
    	}
    };


    //Function for the popupp dialog
    $scope.clickToOpen = function () {
    	console.log("open")
    	$scope.index = moment().valueOf()*Math.random()

        ngDialog.open({ template: 'template.html',
        				scope:$scope

        				 });  
    };

    //Function for updating the status button

    //GET THE STATUS FROM THE DATABASE TODO
    $scope.tooglePlusMinus = true;

    $scope.updateStatusTime = function (){

    

    	var current_date = JSON.stringify({'current_date':moment().valueOf()});


    	
    	if($scope.tooglePlusMinus){
	    	//Vista + gildi inn ef það á við
	    	Lyf.insertCalDataPlus(current_date);

    	}
    	else{
    		//Vista - gildi inn ef það á við
    		Lyf.insertCalDataMinus(current_date);

    	}
    	//TOOGLA + Í MÍNUS

    	$scope.tooglePlusMinus = !$scope.tooglePlusMinus; 	

    };

    //Function to move between days on the graph
	$scope.moveDay = function (direction) {
		$scope.isSelected = null;
		for (i in $scope.chartConfig.series) {
					$scope.chartConfig.series[i].dashStyle = 'none';
		}		
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
			if (!moment($scope.drugs[i].date).isSame($scope.date)) {
				$scope.drugs[i].show = false;
			}
			else {
				$scope.drugs[i].show = true;
			}
		}
	};

	//Swipe for smartphones
	$scope.swipeGraph = function(desc) {
		if (desc === 'left') 
			$scope.moveDay('left')
		else 
			$scope.moveDay('right')
	};

	//Fonction for so the user can decide witch of the drugs he has selected are gonna be used
	$scope.clickCheckbox = function (id, checked) {
		for (var i in $scope.chartConfig.series) {
			if ($scope.chartConfig.series[i].id === id) {
				if (checked === true) {
					$scope.chartConfig.series[i].visible = true;
					if ($scope.isSelected === id) $scope.clock_time = $scope.chartConfig.series[i].stringTime;
				}
				else {
					$scope.chartConfig.series[i].visible = false;
				}
				$scope.createDrug($scope.chartConfig.series[i]);
			}
		}
		$scope.updateSumGraph($scope.chartConfig.series);
	};

	// function to call an update for the sumgraph from the timepicker (scroller)
	$scope.updateFromScroll = function() {
		// console.log("updatefromscroll")
		$scope.updateSumGraph($scope.chartConfig.series);
	}

	// WATCH/UPDATE FUNCTIONS //
	
	// $scope.$watch('chartConfig.series', function(newValues) {
	// 		$scope.updateSumGraph(newValues)
	// }, true);

	
	$scope.$watch('clock_time', function (newValue, oldValue) {
        //do something
        var d = moment();
        if(typeof newValue !== 'undefined'){
        	var res = newValue.split(":");
	      	
	      	$scope.graphTime = moment({y: $scope.date.year(), M: $scope.date.month(), d: $scope.date.date(), h: res[0], m: res[1]}).valueOf()
	        $scope.stringTime = newValue;
   		 }
	    else {
	    	$scope.graphTime = moment().valueOf();
	    	$scope.stringTime = $scope.prenta(d.minutes(), d.hours());
	    }
    });


    $scope.$watch('graphTime', function(newValue) {

    	for (i in $scope.chartConfig.series) {
    		if ($scope.isSelected === $scope.chartConfig.series[i].id && $scope.chartConfig.series[i].checked) { // find the drug with matching id
    			for (j in $scope.chartConfig.series[i].data) { // loop through its every data point
    				// TODO: if (timepicker === scroller) update database
    				$scope.chartConfig.series[i].data[j][0] += ($scope.graphTime - $scope.chartConfig.series[i].graphTime);	// update its x component with the offset between its graphTime and desired time
    			}
    			var d = moment($scope.graphTime);
    			$scope.chartConfig.series[i].graphTime = $scope.graphTime; // update the graph's graphTime
    			$scope.chartConfig.series[i].stringTime = $scope.prenta(d.minutes(), d.hours()) // update the graph's stringTime
    			$scope.drugs[i-1] = $scope.chartConfig.series[i] // copy the graph to the drugs array
    		}
    	}
    	$scope.updateSumGraph($scope.chartConfig.series);
    });

    // $scope.$watch('isSelected', function(newValue) {
  //   	if (newValue === null) {
  //   		for (i in $scope.chartConfig.series) {
		// 		$scope.chartConfig.series[i].dashStyle = false;
		// 	}
  //   	}
		// else {
		// 	for (i in $scope.chartConfig.series) {
		// 		if ($scope.isSelected === $scope.chartConfig.series[i].id) {
		// 			$scope.chartConfig.series[i].dashStyle = 'shortdash';

		// 		}
		// 		else {
		// 			$scope.chartConfig.series[i].dashStyle = false
		// 		}
		// 	}
  //   	}
    // });

    $scope.prenta = function(minutes,hours){
		if (hours.toString().length == 1){
			hours = '0' + hours;
		}
		if (minutes.toString().length== 1){
			 minutes = '0' + minutes;
		}
		return hours + ":" + minutes;
	};

	$scope.save = function(id) {
		for (i in $scope.chartConfig.series) {
    				if (id === $scope.chartConfig.series[i].id) { // find the drug with matching id
    					$scope.createDrug($scope.chartConfig.series[i]);
    					$scope.chartConfig.series[i].dashStyle = false
    				}
		}
		$scope.isSelected = null;
	}

	$scope.logOutFunc = function(){

		 if (authService.isAuthenticated) {
                authService.isAuthenticated = false;
                delete $window.sessionStorage.token;
                $location.path("/");
            }
	          
		   }

	$scope.$on('heightChange', function(event, data) { 
	// 	var container = document.getElementById("drug-chart");
	// 	var ang_container = angular.element(container); 
		if (ang_container.height() > 100) $scope.chartConfig.options.chart.height = ang_container.height();
	});

	var blabla = []

// CONVERTER VÉLIN
blabla.push(0.00)
blabla.push(0.00)
blabla.push(0.00)
blabla.push(0.00)
blabla.push(0.00)
blabla.push(4.72)
blabla.push(27.45)
blabla.push(54.61)
blabla.push(85.58)
blabla.push(119.80)
blabla.push(156.73)
blabla.push(195.88)
blabla.push(236.78)
blabla.push(278.98)
blabla.push(322.10)
blabla.push(365.75)
blabla.push(409.58)
blabla.push(453.28)
blabla.push(496.56)
blabla.push(539.14)
blabla.push(580.79)
blabla.push(621.28)
blabla.push(660.42)
blabla.push(698.03)
blabla.push(733.95)
blabla.push(768.05)
blabla.push(800.21)
blabla.push(830.33)
blabla.push(858.33)
blabla.push(884.14)
blabla.push(907.71)
blabla.push(929.00)
blabla.push(947.99)
blabla.push(964.65)
blabla.push(979.01)
blabla.push(991.06)
blabla.push(1000.82)
blabla.push(1008.34)
blabla.push(1013.64)
blabla.push(1016.78)
blabla.push(1017.82)
blabla.push(1016.81)
blabla.push(1013.83)
blabla.push(1008.96)
blabla.push(1002.26)
blabla.push(993.84)
blabla.push(983.77)
blabla.push(972.15)
blabla.push(959.08)
blabla.push(944.64)
blabla.push(928.96)
blabla.push(912.11)
blabla.push(894.21)
blabla.push(875.36)
blabla.push(855.65)
blabla.push(835.20)
blabla.push(814.10)
blabla.push(792.46)
blabla.push(770.37)
blabla.push(747.92)
blabla.push(725.23)
blabla.push(702.37)
blabla.push(679.43)
blabla.push(656.51)
blabla.push(633.68)
blabla.push(611.03)
blabla.push(588.64)
blabla.push(566.57)
blabla.push(544.89)
blabla.push(523.66)
blabla.push(502.95)
blabla.push(482.82)
blabla.push(463.30)
blabla.push(444.45)
blabla.push(426.30)
blabla.push(408.90)
blabla.push(392.27)
blabla.push(376.43)
blabla.push(361.42)
blabla.push(347.24)
blabla.push(333.90)
blabla.push(321.41)
blabla.push(309.77)
blabla.push(298.97)
blabla.push(289.01)
blabla.push(279.87)
blabla.push(271.54)
blabla.push(263.98)
blabla.push(257.18)
blabla.push(251.11)
blabla.push(245.72)
blabla.push(240.98)
blabla.push(236.84)
blabla.push(233.27)
blabla.push(230.22)
blabla.push(227.63)
blabla.push(225.44)
blabla.push(223.62)
blabla.push(222.09)
blabla.push(220.80)
blabla.push(219.69)
blabla.push(218.71)
blabla.push(217.78)
blabla.push(216.86)
blabla.push(215.88)
blabla.push(214.79)
blabla.push(213.52)
blabla.push(212.02)
blabla.push(210.25)
blabla.push(208.16)
blabla.push(205.69)
blabla.push(202.80)
blabla.push(199.47)
blabla.push(195.66)
blabla.push(191.34)
blabla.push(186.50)
blabla.push(181.13)
blabla.push(175.22)
blabla.push(168.77)
blabla.push(161.81)



var yoyo = {}

for (i in blabla) {
	yoyo[i] = new Array(2);
	yoyo[i][0] = parseInt(i);
	yoyo[i][1] = blabla[i];

}
for (i in yoyo) {
	console.log("[");
	console.log(yoyo[i][0] + ',')
	console.log(yoyo[i][1]);
	console.log("],")
}
console.log(yoyo)
});