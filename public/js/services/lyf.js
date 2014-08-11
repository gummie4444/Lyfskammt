angular.module('lyfService', [])

	// super simple service
	// each function returns a promise object 


	//-------- TODO
	//Change this to get the data from the database

	.service('Lyf', function($http) {

			

		return {

			get:function(access_token){
				
				return $http.post('/api/drugs',access_token);
			},

			create:function(nowDrug){
				
				return $http.post('/api/insertdrugs',nowDrug);
			},

			delete : function(id) {
				return $http.delete('/api/drugs/' + id);
			},

			
			insertCalDataPlus:function(dataArray){

				return $http.post('/api/cal_plus', dataArray);

			},
			insertCalDataMinus:function(dataArray){

				return $http.post('/api/cal_minus', dataArray);

			},
			updateDrugData : function(access_token){
				return $http.post('/api/drug_data',access_token);
				
			},

			createEmpty: function () {
                var array = []
				for (i=0; i<=36; i++) {
					var x_interval = 1800000*i;
					array.push([x_interval, null])
				}
				return array;
            }
        };
	});


