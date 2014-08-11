angular.module('Chart', ['highcharts-ng','ngDialog','ui.slider', 'ngTouch', 'mobiscroll-dir'])

.controller('myChart', function ($scope, Lyf,ngDialog,$log, $window,$http, $timeout) {

	//set the acces_token
	var access_token = JSON.stringify({'access_token':$window.sessionStorage.token});

	
	// ========= //
	// VARIABLES //
	// ========= //
	$scope.loading = true;
	$scope.graphTime = moment().valueOf();
	$scope.drugs= {};
	$scope.index = 0;
	$scope.date = moment({y: moment().year(), M: moment().month(), d:moment().date()})
    $scope.isSelected= null;
    $scope.clock_time = moment().format('HH'+':'+'mm');
    $scope.clock_display;

    $scope.toogleMenu = false;



    $scope.toogleClass = function(){

    	$scope.toogleMenu = !$scope.toogleMenu;
    	$scope.$emit('toogle',$scope.toogleMenu);

    }

	
	
	//Load the drug_data from the database, specificly from the user
	//SKOÐA FÆRA Í LYF?????
	Lyf.updateDrugData(access_token)
		.success(function(data)
		{
			$scope.drug_data = data;

		});

	//Load the drugs from the database, specificly from the user

	Lyf.get(access_token)
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
			current_lyf.data[i][0] += (current_lyf.data[i][0]*1800000 + $scope.graphTime);
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
			access_token: access_token,
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
			sumGraph[i][0] += ($scope.date.valueOf()+21600000+1);
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
							if (Math.abs(drugs[i].data[j][0] - $scope.chartConfig.series[0].data[k][0]) <= 900000) {// round every point on the drug graph to the nearest point on the sum curve (900000ms === 15 minutes)
								$scope.chartConfig.series[0].data[k][1] += drugs[i].data[j][1] // update the sum graph with values from the drug graphs
							}
					}
				}
			}
		}
		$scope.chartConfig.yAxis.plotLines = [{
									color: '#78C983',
					                width: 1,
					                value: $scope.drugs.length*3,
					            }]
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
    	$scope.index = moment().valueOf()*Math.random()

        ngDialog.open({ template: 'template.html',
        				scope:$scope

        				 });  
    };

    //Function for updating the status button

    //GET THE STATUS FROM THE DATABASE TODO
    $scope.tooglePlusMinus = true;

    $scope.updateStatusTime = function (){

    

    	var current_date = moment().valueOf();

    	var dataArray = {access_token:$window.sessionStorage.token,
    					date:current_date};
    	
    	if($scope.tooglePlusMinus){
	    	//Vista + gildi inn ef það á við
	    	Lyf.insertCalDataPlus(dataArray);

    	}
    	else{
    		//Vista - gildi inn ef það á við
    		Lyf.insertCalDataMinus(dataArray);

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
	}

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
});