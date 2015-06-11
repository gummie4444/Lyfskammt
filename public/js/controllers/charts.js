angular.module('Chart', ['highcharts-ng','orderObjectBy-fil','ngDialog','ui.slider', 'ngTouch',  'chart-resize', 'mobiscroll-dir'])

.controller('myChart', function ($scope, Lyf,ngDialog,$log, $window,$http, $timeout, authService, $location) {

	//set the acces_token
	var access_token = JSON.stringify({'access_token':$window.sessionStorage.token});

	// TODO:
	// BÆTA PERFORMANCE YFIRHÖFUÐ
	// TAKA ÚT DRUGS, HAFA BARA CHARTCONFIG

	
	// ========= //
	// VARIABLES //
	// ========= //
	$scope.loading = true;
	$scope.graphTime = moment({y: moment().year(), M: moment().month(), d:moment().date(), h:moment().hour(), m:5*Math.round(moment().minute()/5)}).valueOf();
	// $scope.drugs= {};
	$scope.index = 0;
	$scope.date = moment({y: moment().year(), M: moment().month(), d:moment().date()});
    $scope.isSelected= null;
    $scope.clock_time = moment({y: moment().year(), M: moment().month(), d:moment().date(), h:moment().hour(), m:5*Math.round(moment().minute()/5)}).format('HH'+':'+'mm');
    $scope.stringTime = $scope.clock_time;
    $scope.happy = true;
    $scope.id_array = [];
    $scope.chartConfig ={};

    $scope.invalidTimeError = false;
    $scope.changingHeight = false;
    $scope.changingWeight = false;

    $scope.userHeight = 180; // change this to load from the user's profile
    $scope.userWeight = 75;



    $scope.graph_StartTime = 21600000; // 06:00
    $scope.graph_EndTime = 86400000; // 24:00



    $scope.tempGraph = []; // every selected graph is temporarily overwritten here so we can easily restore it when the cancel button is pressed


	

	
	//Load the drug_data from the database, specificly from the user
	//Here are all the values F,kE,kA and so on inside the drug_data scope



	Lyf.getUserInfo()
		.success(function(userInfo){

			console.log(userInfo)
			$scope.drug_data = userInfo.preferedDrugs;

			var startTime = parseInt(userInfo.startTime)
			var endTime = parseInt(userInfo.endTime)
			
			$scope.optionStartTime = userInfo.startTime;
			$scope.optionEndTime = userInfo.endTime;
			$scope.userName = userInfo.name;

			$scope.graph_StartTime = startTime*1000*60*60; // convert from hours to milliseconds
			$scope.graph_EndTime = endTime*1000*60*60; // convert from hours to milliseconds

			$scope.chartConfig.xAxis.min = $scope.date.valueOf() + $scope.graph_StartTime; 
			$scope.chartConfig.xAxis.max = $scope.date.valueOf() + $scope.graph_EndTime;
			$scope.repeatOn= userInfo.autoPilot;

			//TODO Hérna koma lifinn sem birtast alltaf í plúsnum
			//$scope.preferdDrugs = userInfo.preferedDrugs;
		Lyf.get()
			.success(function(data) {
				for (var drug in data){
					console.log(data)
					console.log($scope.drug_data)
					console.log(templateDrug);
					var drugType = data[drug].drugType;
					var templateDrug = $scope.drug_data[drugType];
					var tempData = $scope.calculateFormula(parseInt(templateDrug.F), parseInt(templateDrug.D), parseInt(templateDrug.kA), parseInt(templateDrug.kE), parseInt(templateDrug.vD));
					data[drug].data = tempData;
					for (i in data[drug].data) {
						data[drug].data[i][0] += (data[drug].data[i][0]*1000*60*15 + parseInt(data[drug].graphTime));
					}
					console.log(data[drug]);
					$scope.chartConfig.series.push(data[drug]);
					$scope.updateShowDrugs();
					$scope.updateSumGraph($scope.chartConfig.series);
				}
				$scope.loading = false;
			});

	});




	Lyf.getCalDataMinus()
		.success(function(CalMinusData)
		{
			
			for (i in CalMinusData){
				$scope.createMoodObj(CalMinusData[i].StartTime,"minus",CalMinusData[i].id)

			}
				$scope.updateSumGraph($scope.chartConfig.series);
			
		});


	Lyf.getCalDataPlus()
	.success(function(CalPlusData)
	{
		for (i in CalPlusData){
			$scope.createMoodObj(CalPlusData[i].StartTime,"plus",CalPlusData[i].id)

		}
			$scope.updateSumGraph($scope.chartConfig.series);

	});



	//Load the drugs from the database, specificly from the user


	


 	$scope.updateShowDrugs = function() {
		for (var i = 1; i < $scope.chartConfig.series.length; i++) {
			$scope.id_array[$scope.chartConfig.series[i].id] = i;

			// $scope.chartConfig.series.push($scope.drugs[i]);
			//console.log($scope.chartConfig.series[i].date)
			if (!moment($scope.chartConfig.series[i].date).isSame($scope.date,'day')) {
				$scope.chartConfig.series[i].show = false;
			}
			else {
				$scope.chartConfig.series[i].show = true;
			}
		}
 	}



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
                stepMinute: 5,
                headerText: false,
    };



	// ========= //
	// FUNCTIONS //
	// ========= //

	$scope.toogleDrug = function(id){

    	$scope.drug_data[id].checked = !$scope.drug_data[id].checked;
    };

	// CREATE ==================================================================
	// Function for adding a drug to the database
	//SKOÐA
	
	$scope.calculateFormula = function(F, D, kA, kE, Vd) {
		var data = [];
		for (i = 0; i < 96; i++) {
			num = (F*D*kA)/(Vd*(kA - kE)); 
			denum = (Math.pow(Math.E, -kE*i*0.25) - Math.pow(Math.E, -kA*i*0.25));
			// C = i;
			var temp = [i, num*denum];
			data.push(temp);
		}
		return data; 
	}


	$scope.createDrug = function(drug) {

		Lyf.create(drug);

				
	};


	//Functon for deleting a drug from the database
	$scope.deleteDrug = function(id) {
			Lyf.delete(id)
				.success(function(data) {
					$scope.loading = false;
					
				});
			$scope.updateSumGraph($scope.chartConfig.series);
		};

	//Functon thats called when we create a drug
	//It updates all the variable and calls the functions to send the info to the database
	$scope.fetch = function(lyf_id) {
		var current_lyf = JSON.parse( JSON.stringify($scope.drug_data[lyf_id-1])); 
		current_lyf.data = $scope.calculateFormula(parseInt(current_lyf.F), parseInt(current_lyf.D), parseInt(current_lyf.kA), parseInt(current_lyf.kE), parseInt(current_lyf.vD));

		for (i in current_lyf.data) {
			current_lyf.data[i][0] += (current_lyf.data[i][0]*1000*60*15 + $scope.graphTime);
		}


		//Breyta data í type og lóda á öðrum stað
		var current_lyf_updated = {
			name: current_lyf.name, 
			amount: "current_lyf.amount", 
			drugType: (lyf_id-1).toString(), // -1 here so it's 0-based index like an array
			data: current_lyf.data, 
			visible: true,
			checked: true, 
			show: true, 
			date: $scope.date.format(), 
			id: $scope.index,
			stringTime:$scope.stringTime,
			graphTime: $scope.graphTime,
			duration : "current_lyf.duration",
			statusStartTime: null,
			statusEndTime:null,
			color: current_lyf.color, 
			day: moment($scope.graphTime).lang("is").format("ddd"),
			current_user:"",

		}
		// $scope.drugs.push(current_lyf_updated);
		$scope.chartConfig.series.push(current_lyf_updated);

		$scope.isSelected = null;	
		$scope.createDrug(current_lyf_updated);
		$scope.id_array[current_lyf_updated.id] = $scope.chartConfig.series.length-1;
		$scope.updateSumGraph($scope.chartConfig.series);
	}
  	
  	//Remove the drug locally from the view
	$scope.removeDrug = function(drug_id) {
		// for (var i in $scope.chartConfig.series) {
		// 	if ($scope.chartConfig.series[i].id === drug_id) {
		// 		var series = $scope.chartConfig.series;
		// 		var array_index = series[i].id;
		// 		console.log(array_index);
		// 		series.splice(i,1);
		// 		$scope.id_array[array_index] = null;
		// 	}
		// }


		if($scope.chartConfig.series[$scope.id_array[drug_id]].dataType === "plus"){
			//TODO EYÐA ÞESSU ÚR PLÚS DÁLK
			Lyf.delete_plus(drug_id);
		}

		else if($scope.chartConfig.series[$scope.id_array[drug_id]].dataType === "minus"){
			//TODO EYÐA ÚR MÍNUS DÁLK
			Lyf.delete_minus(drug_id);
		}

		else{
			$scope.deleteDrug(drug_id);
			$scope.isSelected = null;
		}

				//TODO EYÐA ÞESSU ÚR PLÚS DÁLK
			var index = $scope.chartConfig.series[$scope.id_array[drug_id]].id;
			$scope.chartConfig.series.splice($scope.id_array[drug_id],1)
			$scope.id_array = [];
			for (var i = 1; i < $scope.chartConfig.series.length; i++) {
						$scope.id_array[$scope.chartConfig.series[i].id] = i;
				}
			// $scope.id_array[drug_id] = null;
			$scope.updateSumGraph($scope.chartConfig.series)
			$scope.isSelected = null;
	}
	//Create a empty graph for the init of the graph
	$scope.createEmptySumGraph = function () {
    	var sumGraph = JSON.parse(JSON.stringify(Lyf.createEmpty())); // cloning an empty drug
    	for (i in sumGraph) {
			sumGraph[i][0] += ($scope.date.valueOf()); // offset 6 hours because we only show 06:00-24:00 change this for the  Start/endtime
		}
		return sumGraph;	
    }

    $scope.createMoodObj = function(date,type,index){
    	var tempColor = "#e74c3c"
    	if (type === "plus"){

    		var tempColor = "#16a085"
    	}
    	else{
    		var tempColor = "#e74c3c"

    	}
    	var temp= [];

    	temp[0] = parseInt(date);
		temp[1] = 100;
		var tempDateTime = moment(parseInt(date));
		var stringTempDateTime =  $scope.prenta(tempDateTime.minutes(), tempDateTime.hours());



    	var temp_plus = {
					name: type,
					type:"spline",
					dataType: type,
					data: temp, 
					visible: false,
					checked: true, 
					show: true, 
					date: moment(parseInt(date)).format(), 
					id: index,
					stringTime:stringTempDateTime,
					graphTime: parseInt(date),
					statusStartTime: null,
					statusEndTime:null,
					color: tempColor, 
					day: moment(parseInt(date)).lang("is").format("ddd"),
					current_user:"",

				}
			$scope.chartConfig.series.push(temp_plus);
			$scope.id_array[temp_plus.id] = $scope.chartConfig.series.length-1;


    };



    $scope.updateSumGraph = function (drugs) {
    	$scope.updateShowDrugs();

    	$scope.chartConfig.series[0].data = $scope.createEmptySumGraph(); // always reset the sum graph to recalculate + draw
    	if ($scope.chartConfig.series.length > 2) { // only draw the sumGraph if there's more than one drug stored
			for (i in drugs) { // iterate through every drug
				if (drugs[i].visible === true) {
					for (j in drugs[i].data) { // iterate through every data point per drug
						for (k in $scope.chartConfig.series[0].data) // iterate through every data point in the "sum" curve
							if (Math.abs(drugs[i].data[j][0] - $scope.chartConfig.series[0].data[k][0]) <= 450000) {// round every point on the drug graph to the nearest point on the sum curve (45000ms === 7.5 minutes)
								$scope.chartConfig.series[0].data[k][1] += drugs[i].data[j][1]; // update the sum graph with values from the drug graphs
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
				animation: true,
				height: ang_container.height()*1.02796,
				width: ang_container.width()

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
	            		enabled:false
	            	}
	            },
	            line: {
	            	lineWidth: 3
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
			name : "sumGraph",
		}
		],
		
		title: {
			text: moment($scope.date).lang("is").format("dddd Do MMMM")
		},
		xAxis: {
			plotLines: [{
				color: '#2c3e50',
                width: 1,
                value: moment().valueOf(),
            }],
			min : $scope.date.valueOf()+$scope.graph_StartTime, // 06:00
			max : $scope.date.valueOf()+$scope.graph_EndTime,  // 24:00
			type: 'datetime'
		},
		yAxis: {
			plotLines: [{
				color: '#bdc3c7',
                width: 7,
                value: 2000,
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
    	//$scope.chartConfig.series[$scope.id_array[Selected]].dashStyle = 'shortdash';
    	console.log($scope.chartConfig.series[$scope.id_array[Selected]])
		$scope.clock_time = $scope.chartConfig.series[$scope.id_array[Selected]].stringTime;

		$scope.tempGraph = JSON.parse( JSON.stringify($scope.chartConfig.series[$scope.id_array[Selected]])); 

    	if ($scope.isSelected === Selected) {
    		$scope.save(Selected);
		}
    	else {
    		$scope.isSelected = Selected;
    	}


   //  	if (Selected === null) {
   //  		for (i in $scope.chartConfig.series) {
			// 	$scope.chartConfig.series[i].dashStyle = false;
			// }
   //  	}
		// else {
			// TODO: PERFORMANCE - HÆGT?
			
			// for (i in $scope.chartConfig.series) {
			// 	if ($scope.isSelected === $scope.chartConfig.series[i].id) {
			// 		$scope.chartConfig.series[i].dashStyle = 'shortdash';
			// 		$scope.clock_time = $scope.chartConfig.series[i].stringTime;
			// 		break;
			// 	}
			// 	else {
			// 		$scope.chartConfig.series[i].dashStyle = false;
			// 	}
			// }
    	// }
    };

    //Function for the popupp dialog
    $scope.clickToOpen = function () {
    	$scope.index = Math.round(moment().valueOf()/Math.random()/10000000000);
        ngDialog.open({ template: 'template.html',
        				scope:$scope
        				 });  
    };

    $scope.clickToOpen2 = function (){
    	 console.log("hallo")
    	console.log($scope.drug_data)
    	$scope.index = Math.round(moment().valueOf()/Math.random()/10000000000);
        ngDialog.open({ template: 'template2.html',
        				scope:$scope
        				 });  
    }

    //Function for updating the status button

    //GET THE STATUS FROM THE DATABASE TODO
    $scope.tooglePlusMinus = true;

    $scope.updateStatusTime = function (){


    	var tempIndex = Math.round(moment().valueOf()/Math.random()/10000);
    	var info = JSON.stringify({'current_date':$scope.graphTime.valueOf(),'index': tempIndex});

    	
    	if($scope.happy){
	    	//Vista + gildi inn ef það á við

	    	$scope.createMoodObj($scope.graphTime.valueOf(),"plus",tempIndex);
	    	Lyf.insertCalDataPlus(info);

    	}
    	else{
    		//Vista - gildi inn ef það á við

    		$scope.createMoodObj($scope.graphTime.valueOf(),"minus",tempIndex);
    		 Lyf.insertCalDataMinus(info);

    	}
    	//TOOGLA + Í MÍNUS
    	$scope.updateSumGraph($scope.chartConfig.series);
    	$scope.happy = !$scope.happy; 	

    };

    //Function to move between days on the graph
	$scope.moveDay = function (direction, id) {
		$scope.isSelected = null;
		if (id !== null)
			$scope.chartConfig.series[$scope.id_array[id]].dashStyle = false;
		// for (i in $scope.chartConfig.series) {
		// 			$scope.chartConfig.series[i].dashStyle = false;
		// }		
		if (direction === "left") {
			$scope.date.subtract('d', 1);
		}
		else {
			$scope.date.add('d', 1);
		}
		$scope.chartConfig.title.text = moment($scope.date).lang("is").format("dddd Do MMMM"); // update the date at top
		$scope.chartConfig.xAxis.min = $scope.date.valueOf()+$scope.graph_StartTime; // update the leftmost x-value
		$scope.chartConfig.xAxis.max = $scope.date.valueOf()+$scope.graph_EndTime; // update the rightmost x-value

		// $scope.updateSumGraph($scope.chartConfig.series); // show the updated sum graph

		var time_split = $scope.stringTime.split(":");

		$scope.graphTime = moment({y: $scope.date.year(), M: $scope.date.month(), d: $scope.date.date(), h: time_split[0], m: time_split[1]}).valueOf();

		for (var i in $scope.chartConfig.series) {


			if (!moment($scope.chartConfig.series[i].date).isSame($scope.date,'day')) {
				$scope.chartConfig.series[i].show = false;
			}
			else {
				$scope.chartConfig.series[i].show = true;
			}
		}
	};

	//Swipe for smartphones
	$scope.swipeGraph = function(desc) {
		if (desc === 'left') 
			$scope.moveDay('left');
		else 
			$scope.moveDay('right');
	};

	//Fonction for so the user can decide witch of the drugs he has selected are gonna be used
	$scope.clickCheckbox = function (id, checked) {
		if (checked) {
			$scope.chartConfig.series[$scope.id_array[id]].visible = true;
			if ($scope.isSelected === id)
				$scope.clock_time = $scope.chartConfig.series[[$scope.id_array[id]]].stringTime;
		} else {
			$scope.chartConfig.series[$scope.id_array[id]].visible = false;
		}
		// for (var i in $scope.chartConfig.series) {
		// 	if ($scope.chartConfig.series[i].id === id) {
		// 		if (checked === true) {
		// 			$scope.chartConfig.series[i].visible = true;
		// 			if ($scope.isSelected === id) $scope.clock_time = $scope.chartConfig.series[i].stringTime;
		// 		}
		// 		else {
		// 			$scope.chartConfig.series[i].visible = false;
		// 		}
		// 		$scope.createDrug($scope.chartConfig.series[i]);
		// 	}
		// }
		$scope.createDrug($scope.chartConfig.series[$scope.id_array[id]]);
		$scope.updateSumGraph($scope.chartConfig.series);
	};

	$scope.pickFavDrugs = function(){


	};
	$scope.applySettings = function() {
		var startTime = parseInt(angular.element(document.getElementById('graphStartTime')).val())
		var endTime = parseInt(angular.element(document.getElementById('graphEndTime')).val())
	

		$scope.graph_StartTime = startTime*1000*60*60; // convert from hours to milliseconds
		$scope.graph_EndTime = endTime*1000*60*60; // convert from hours to milliseconds
		if (startTime >= endTime) {
			$scope.invalidTimeError = true;
			return;
		}
		$scope.chartConfig.xAxis.min = $scope.date.valueOf() + $scope.graph_StartTime; 
		$scope.chartConfig.xAxis.max = $scope.date.valueOf() + $scope.graph_EndTime;

		Lyf.updateUser(startTime,endTime,$scope.repeatOn,$scope.drug_data)
			.success(function(data)
			{
				console.log(data);
			});
		$scope.invalidTimeError = false;
		$scope.showSettingsMenu();
		$scope.showSettings();
	}

	$scope.changeHeight = function() {
		$scope.changingHeight = !$scope.changingHeight;
	}

	$scope.changeWeight = function() {
		$scope.changingWeight = !$scope.changingWeight;
	}

	$scope.updateHeight = function() {
		var height = angular.element(document.getElementById('heightInput')).val()
		angular.element(document.getElementById('heightSpan')).text(height)
		$scope.changingHeight = !$scope.changingHeight;
	}

	$scope.updateWeight = function() {
		var height = angular.element(document.getElementById('weightInput')).val()
		angular.element(document.getElementById('weightSpan')).text(height)
		$scope.changingWeight = !$scope.changingWeight;
	}





	// WATCH/UPDATE FUNCTIONS //

	
	$scope.$watch('clock_time', function (newValue, oldValue) {
        //do something
        var d = moment({y: moment().year(), M: moment().month(), d:moment().date(), h:moment().hour(), m:5*Math.round(moment().minute()/5)});
        if(typeof newValue !== 'undefined'){
        	var res = newValue.split(":");
	      	
	      	$scope.graphTime = moment({y: $scope.date.year(), M: $scope.date.month(), d: $scope.date.date(), h: res[0], m: res[1]}).valueOf();
	        $scope.stringTime = newValue;
   		 }
	    else {
	    	$scope.graphTime = moment({y: moment().year(), M: moment().month(), d:moment().date(), h:moment().hour(), m:5*Math.round(moment().minute()/5)}).valueOf();;
	    	$scope.stringTime = $scope.prenta(d.minutes(), d.hours());
	    }
    });	


    $scope.$watch('graphTime', function(newValue) {
    	if ($scope.isSelected !== null) {
    		if ($scope.chartConfig.series[$scope.id_array[$scope.isSelected]].checked) {
	    		for (j in $scope.chartConfig.series[$scope.id_array[$scope.isSelected]].data) {
	    			$scope.chartConfig.series[$scope.id_array[$scope.isSelected]].data[j][0] += ($scope.graphTime - $scope.chartConfig.series[$scope.id_array[$scope.isSelected]].graphTime) // update its x component with the offset between its graphTime and desired time
	    		}
	    		var d = moment($scope.graphTime);
				$scope.chartConfig.series[$scope.id_array[$scope.isSelected]].graphTime = $scope.graphTime; // update the graph's graphTime
				$scope.chartConfig.series[$scope.id_array[$scope.isSelected]].stringTime = $scope.prenta(d.minutes(), d.hours()); // update the graph's stringTime
			}
    	}
    	// for (i in $scope.chartConfig.series) {
    	// 	if ($scope.isSelected === $scope.chartConfig.series[i].id && $scope.chartConfig.series[i].checked) { // find the drug with matching id
    	// 		for (j in $scope.chartConfig.series[i].data) { // loop through its every data point
    	// 			// TODO: if (timepicker === scroller) update database
    	// 			$scope.chartConfig.series[i].data[j][0] += ($scope.graphTime - $scope.chartConfig.series[i].graphTime);	// update its x component with the offset between its graphTime and desired time
    	// 		}
    	// 		var d = moment($scope.graphTime);
    	// 		$scope.chartConfig.series[i].graphTime = $scope.graphTime; // update the graph's graphTime
    	// 		$scope.chartConfig.series[i].stringTime = $scope.prenta(d.minutes(), d.hours()); // update the graph's stringTime
    	// 		// $scope.drugs[i-1] = $scope.chartConfig.series[i]; // copy the graph to the drugs array
    	// 	}
    	// }
    	$scope.updateSumGraph($scope.chartConfig.series);
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

	$scope.save = function(id) {
		console.log(id +  "her er id");
		if($scope.chartConfig.series[$scope.id_array[id]].name === "plus"){

			//TODO EYÐA ÞESSU ÚR PLÚS DÁLK
			var info = JSON.stringify({'current_date':$scope.graphTime.valueOf(),'index': id});
			$scope.isSelected = null;
			Lyf.insertCalDataPlus(info);
			console.log("sent");


		//UPDATE	Lyf.delete_plus(drug_id);


		}
		else if($scope.chartConfig.series[$scope.id_array[id]].name === "minus"){

			//TODO EYÐA ÚR MÍNUS DÁLK
			var info = JSON.stringify({'current_date':$scope.graphTime.valueOf(),'index': id});
			Lyf.insertCalDataMinus(info);
			$scope.isSelected = null;
		
		//UPDATE todo

		}
		else{


		$scope.createDrug($scope.chartConfig.series[$scope.id_array[id]]);
		$scope.chartConfig.series[$scope.id_array[id]].dashStyle = false;
		$scope.isSelected = null;

		}
		$scope.updateSumGraph($scope.chartConfig.series);

		// for (i in $scope.chartConfig.series) {
  //   				if (id === $scope.chartConfig.series[i].id) { // find the drug with matching id
  //   					$scope.createDrug($scope.chartConfig.series[i]);
  //   					$scope.chartConfig.series[i].dashStyle = false;
  //   				}
		// }
	};

	$scope.cancel = function(id) {
		$scope.chartConfig.series[$scope.id_array[id]] = $scope.tempGraph;
		$scope.chartConfig.series[$scope.id_array[id]].dashStyle = false;
		$scope.isSelected = null;
		$scope.updateSumGraph($scope.chartConfig.series);
	}

	$scope.logOutFunc = function(){
		 if (authService.isAuthenticated) {
                authService.isAuthenticated = false;
                delete $window.sessionStorage.token;
                $location.path("/");
            }
	};

	$scope.$on('heightChange', function(event, data) { 
		// 	var container = document.getElementById("drug-chart");
		// 	var ang_container = angular.element(container); 
		if (ang_container.height() > 100) $scope.chartConfig.options.chart.height = ang_container.height();
		if (ang_container.width() > 100) $scope.chartConfig.options.chart.width = ang_container.width();
	});
});