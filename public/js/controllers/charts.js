angular.module('Chart', ['highcharts-ng','ngDialog','ui.slider'])

.controller('myChart', function ($scope, Lyf,ngDialog,$log) {
  

	 $scope.date = function (){
            var now =0;
            var now = new Date();
            var time = dateFormat(now, "HH:mm");
            console.log(time);
            $scope.bla = time;
        };
	
	$scope.fetch = function(lyf_id) {
		return Lyf.getLyf(lyf_id);
	}
  

        function convert (ev,ui){

            var hours = Math.floor(ui.value / 60);
                var minutes = ui.value - (hours * 60);
                

                if(hours.toString().length == 1) hours = '0' + hours;
                if(minutes.toString().length== 1) minutes = '0' + minutes;
                value = hours + ":"+ minutes;
                $scope.prufa.options.value = value;

        }

        $scope.prufa = {

            options:{
                min: 0,
                max: 1440,
                step: 10,
                value:500,  
                slide:convert
            }
        };

	$scope.drugs= [
	
				
		];
  

    $scope.clickToOpen = function () {
    	$scope.drugData = {};
        ngDialog.open({ template: 'template.html',
        				scope:$scope

        				 });  
    };



	$scope.lyf_all = Lyf.getAll();

	$scope.chosen_lyf1 = $scope.lyf_all[0];
	$scope.chosen_lyf2 = $scope.lyf_all[0];
	$scope.chosen_lyf3 = $scope.lyf_all[0];
	$scope.chosen_lyf4 = $scope.lyf_all[0];
	

	$scope.chartConfig = {
		options: {
			chart: {
				zoomType: 'x',
				
			},
			legend: {
				enabled: false
			}
			
		},
		series: [{
			data: Lyf.createEmpty()
		},
		{
			data: Lyf.createEmpty()
		},
		{
			data: Lyf.createEmpty()
		},
		{
			data: Lyf.createEmpty()
		},
		{
			data: Lyf.createEmpty(),
			zIndex: 1,
			lineWidth: 10
		}],
		title: {
			text: 'Lyf'
		},
		xAxis: {
			min : Date.now(), 
			type: 'datetime'
			
		},
		yAxis: {
			min : 0,
			gridLineWidth: 0,
			minorGridLineWidth: 0
		},
		loading: false
	}

	// $scope.update = function() {
		// $scope.chartConfig.series[0].data = $scope.chosen_lyf1.data;
		// $scope.chartConfig.series[1].data = $scope.chosen_lyf2.data;
		// $scope.chartConfig.series[2].data = $scope.chosen_lyf3.data;
		// $scope.chartConfig.series[3].data = $scope.chosen_lyf4.data;
	// }
	
	// $scope.$watchCollection('[chosen_lyf1, chosen_lyf2, chosen_lyf3, chosen_lyf4]', function(newValues) {
		// $scope.chartConfig.series[4].data = Lyf.createEmpty();
		// for (i=0; i<4; i++) {
			// $scope.chartConfig.series[i].data = newValues[i].data
			// for (j=0; j<48; j++) {
				// if (typeof newValues[i].data[j] !== 'undefined')
				// $scope.chartConfig.series[4].data[j][1] += newValues[i].data[j][1]
			// }
		// }
	// });
	
	$scope.$watch('drugs', function(newValues) {
		$scope.chartConfig.series[4].data = Lyf.createEmpty();
		// console.log(newValues)
		for (i in newValues) {
				$scope.chartConfig.series[i].data = newValues[i].data
			for (j=0; j<48; j++) {
				if (typeof newValues[i].data[j] !== 'undefined')
				$scope.chartConfig.series[4].data[j][1] += newValues[i].data[j][1]
			}
		}
	}, true)
});