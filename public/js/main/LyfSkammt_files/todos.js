angular.module('mainService', [])

	// super simple service
	// each function returns a promise object 


	//-------- TODO
	//Change this to get the data from the database

	.factory('Todos', function($http) {
		return {
			get : function() {
				return $http.get('/api/todos');
			},
			create : function(todoData) {
				return $http.post('/api/todos', todoData);
			},
			delete : function(id) {
				return $http.delete('/api/todos/' + id);
			}
		}
	});


