angular.module('lyfService', [])

	// super simple service
	// each function returns a promise object 


	//-------- TODO
	//Change this to get the data from the database

	.service('Lyf', function() {
	
	var create_lyf1_placeholder = function() {
		var array = []
		for (i=0; i<48; i++) {
			var current_date = Date.now()+1800000*i;
			if (((-(Math.pow((i-24),2)) + 576)/72) >= 0)
			array.push([current_date,(-(Math.pow((i-24),2)) + 576)/72])
			else array.push([current_date,-0.05])
		}
		return array;
	}
	
	var create_lyf2_placeholder = function() {
		var array = []
		for (i=0; i<48; i++) {
			var current_date = Date.now()+1800000*i;
			if (((-(Math.pow((i-40),2)) + 400)/72) >= 0)
			array.push([current_date,(-(Math.pow((i-40),2)) + 400)/72])
			else array.push([current_date,-0.05])
		}
		return array;
	}
	
	var create_lyf3_placeholder = function() {
		var array = []
		for (i=0; i<48; i++) {
			var current_date = Date.now()+1800000*i;
			if (((-(Math.pow((i-16),2)) + 360)/72) >= 0)
			array.push([current_date,(-(Math.pow((i-16),2)) + 360)/72])
			else array.push([current_date,-0.05])
		}
		return array;
	}
	
	var create_lyf4_placeholder = function() {
		var array = []
		for (i=0; i<48; i++) {
			var current_date = Date.now()+1800000*i;
			if (((-(Math.pow((i-20),2)) + 600)/72) >= 0)
			array.push([current_date,(-(Math.pow((i-20),2)) + 600)/72])
			else array.push([current_date,-0.05])
		}
		return array;
	}
	
	
		var lyf = [ 
		{ name : "Veldu lyf",
		  data : []
		  },
		{ name : "Lyf 1", 
		  data: create_lyf1_placeholder()
		},  
		{ name : "Lyf 2", 
		  data: create_lyf2_placeholder()
		},  
		{ name : "Lyf 3", 
		  data: create_lyf3_placeholder()
		},
		{ name : "Lyf 4", 
		  data: create_lyf4_placeholder()
		}];	
		
		// var selected_lyf = lyf[2]
		
		return {
            getAll: function () {
                return lyf;
            },
			getLyf: function (lyf_id) {
				return lyf[lyf_id].data;
			},
			createEmpty: function () {
                var array = []
				for (i=0; i<48; i++) {
					var current_date = Date.now()+1800000*i;
					array.push([current_date, 0])
				}
				return array;
            }
			// getCurrent: function () {
				// return selected_lyf;
            // }
        };
	});


