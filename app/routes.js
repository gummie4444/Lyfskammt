

//_______ TODO CHANGE THIS FOR OUR DATABASE



var Todo = require('./models/todo');



module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all todos
	app.get('/api/drugs', function(req, res) {

		// use mongoose to get all todos in the database
		Todo.find(function(err, todos) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err);
				

			res.json(todos); // return all todos in JSON format
		});
	});

	// create todo and send back all todos after creation
	app.post('/api/drugs', function(req, res) {

		Todo.update({
			id: req.body.id,
		}, 
		{$set: { 	
			day: req.body.day,
			color: req.body.color,
			graphTime: req.body.graphTime,
			stringTime: req.body.stringTime,
			id: req.body.id,
			data: req.body.data,
			amount: req.body.amount,
			name: req.body.name 
		}
		}
		, {upsert: true}, function(err, todo) {
			if (err)
				res.send(err);
				

			// get and return all the todos after you create another
			Todo.find(function(err, todos) {
				if (err)
					res.send(err);
				res.json(todos);
				
			});
		});

		// create a todo, information comes from AJAX request from Angular
		// Todo.create({
		// 	day: req.body.day,
		// 	color: req.body.color,
		// 	graphTime: req.body.graphTime,
		// 	stringTime: req.body.stringTime,
		// 	id: req.body.id,
		// 	data: req.body.data,
		// 	amount: req.body.amount,
		// 	name: req.body.name
			
		// }, function(err, todo) {
		// 	if (err)
		// 		res.send(err);
				

		// 	// get and return all the todos after you create another
		// 	Todo.find(function(err, todos) {
		// 		if (err)
		// 			res.send(err);
		// 		res.json(todos);
				
		// 	});
		// });

	});

	// delete a todo
	app.delete('/api/drugs/:todo_id', function(req, res) {
		Todo.remove({
			_id : req.params.todo_id
		}, function(err, todo) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Todo.find(function(err, todos) {
				if (err)
					res.send(err);
				res.json(todos);
			});
		});
	});

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};