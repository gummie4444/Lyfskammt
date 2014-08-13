angular.module('lyfService', [])

	// super simple service
	// each function returns a promise object 


	//-------- TODO
	//Change this to get the data from the database

	.service('Lyf', function($http) {

			

		return {

			get:function(){
				
				return $http.get('/api/drugs');
			},

			create:function(nowDrug){
				
				return $http.post('/api/insertdrugs',nowDrug);
			},

			delete : function(id) {
				return $http.delete('/api/drugs/' + id);
			},

			getUsers : function(){
				return $http.get('/api/users/reg');
			},

			
			insertCalDataPlus:function(date){

				return $http.post('/api/cal_plus', date);

			},
			insertCalDataMinus:function(date){

				return $http.post('/api/cal_minus', date);

			},
			updateDrugData : function(){
				return $http.get('/api/drug_data');
				
			},

			createEmpty: function () {
                var array = []
				for (i=0; i<=72; i++) {
					var x_interval = 900000*i;
					array.push([x_interval, null])
				}
				return array;
            }
        };
	});


