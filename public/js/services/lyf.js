angular.module('lyfService', [])

	// super simple service
	// each function returns a promise object 


	//-------- TODO
	//Change this to get the data from the database

	.service('Lyf', function($http) {
	
	var create_lyf1_placeholder = function() {
		var array = []
		for (i=0; i<=48; i++) {
			var x_interval = 1800000*i;
			if (((-(Math.pow((i-24),2)) + 576)/72) >= 0)
			array.push([x_interval,(-(Math.pow((i-24),2)) + 576)/72])
			else array.push([x_interval,null])
		}
		return array;
	}
	
	var create_lyf2_placeholder = function() {
		var array = []
		for (i=0; i<=48; i++) {
			var x_interval = 1800000*i;
			if (((-(Math.pow((i-40),2)) + 400)/72) >= 0)
			array.push([x_interval,(-(Math.pow((i-40),2)) + 400)/72])
			else array.push([x_interval,null])
		}
		return array;
	}
	
	var create_lyf3_placeholder = function() {
		var array = []
		for (i=0; i<=48; i++) {
			var x_interval = 1800000*i;
			if (((-(Math.pow((i-16),2)) + 360)/72) >= 0)
			array.push([x_interval,(-(Math.pow((i-16),2)) + 360)/72])
			else array.push([x_interval,null])
		}
		return array;
	}
	
	var create_lyf4_placeholder = function() {
		var array = []
		for (i=0; i<=48; i++) {
			var x_interval = 1800000*i;
			if (((-(Math.pow((i-20),2)) + 600)/72) >= 0)
			array.push([x_interval,(-(Math.pow((i-20),2)) + 600)/72])
			else array.push([x_interval,null])
		}
		return array;
	}
	
	
		var lyf = [ 
		{ 
			name : "Lyf 1", 
			amount: "2 mg",
			data: create_lyf1_placeholder(),
			color: "#D4D726" // yellow
		},  
		{ 
			name : "Lyf 2", 
			amount: "4 mg",
			data: create_lyf2_placeholder(),
			color: "#67AA46" // green
		},  
		{ 
			name : "Lyf 3", 
			amount: "2 mg",
			data: create_lyf3_placeholder(),
			color: "#BE2020" // red
		},
		{ 
			name : "Lyf 4", 
			amount: "3 mg",
			data: create_lyf4_placeholder(),
			color: "#5CA2B0" // blue
		}];	
		
		return {

			get:function(){
				return $http.get('/api/todos');
			},

			create:function(nowDrug){
				return $http.post('/api/todos',nowDrug );
			},

            getAll: function () {
                return lyf;
            },
			getLyf: function (lyf_id) {
				return lyf[lyf_id-1];
			},
			createEmpty: function () {
                var array = []
				for (i=0; i<=48; i++) {
					var x_interval = 1800000*i;
					array.push([x_interval, null])
				}
				return array;
            }
        };
	});


