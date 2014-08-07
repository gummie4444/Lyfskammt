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
		// array.push([0*1800000,0])
		// array.push([1*1800000,10])
		// array.push([2*1800000,11])
		// array.push([3*1800000,12])
		// array.push([4*1800000,10])
		// array.push([5*1800000,9])
		// array.push([6*1800000,7])
		// array.push([7*1800000,5])
		// array.push([8*1800000,4])
		// array.push([9*1800000,3])
		// array.push([10*1800000,2])
		// array.push([11*1800000,0])
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
			color: "#f1c40f" // yellow
		},  
		{ 
			name : "Lyf 2", 
			amount: "4 mg",
			data: create_lyf2_placeholder(),
			color: "#27ae60" // green
		},  
		{ 
			name : "Lyf 3", 
			amount: "2 mg",
			data: create_lyf3_placeholder(),
			color: "#c0392b" // red
		},
		{ 
			name : "Lyf 4", 
			amount: "3 mg",
			data: create_lyf4_placeholder(),
			color: "#3498db" // blue
		}];	
		
		return {

			get:function(access_token){
				console.log("herereg");
				return $http.post('/api/getdrugs',access_token);
			},

			create:function(nowDrug){
				
				return $http.post('/api/insertdrugs',nowDrug);
			},

			delete : function(id) {
				return $http.delete('/api/drugs/' + id);
			},

            getAll: function () {
                return lyf;
            },
			getLyf: function (lyf_id) {
				return lyf[lyf_id-1];
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


