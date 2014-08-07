

//_______ TODO CHANGE THIS FOR OUR DATABASE



var Todo = require('./models/todo');
var User = require ('./models/user');
var Drug_data = require('./models/drug_data');


var jwt = require('jwt-simple');
var express  = require('express');
var secret = require('../config/secret');
var jwtauth = require('./jwtauth.js');
var moment = require('moment');


module.exports = function(app) {


	//API FOR USERS


	// create todo and send back all todos after creation

	//HANDLE LOGINS
	app.post('/api/users',function(req,res){

		var username = req.body.username ;
   		var password = req.body.password ;


		User.findOne({username: username}, function(err,users){

			if(err){
				console.log(err + "VIlla1");
				return res.send(401);
			}
			
			if(users == undefined){
				console.log(err + "VIlla2");
				return res.send(401);
			}

			

			users.comparePassword(password, function(isMatch){
				if (!isMatch){
					console.log("Attempt failed to login with: " + users.username);
					return res.send(401);
				}
				
				console.log("Loggadi mig inn med: " + users.username );

				//Create a token for the current user

				var expires = moment().add(1,'days').valueOf();

				var token = jwt.encode({iss: users._id,
										exp:expires
										}, secret.secretToken);
										
				console.log(token + "token");
				return res.json({token:token});
				
			});

			
		})


	});

	//HANDLE LOGOUTS skoða
	/*
	app.get('/api/users/logOut',function(req,res){
		console.log(req.headers);

		if (req.user) {
		tokenManager.expireToken(req.headers);

		delete req.user;	
		return res.send(200);
		}
		else {
			return res.send(401);
		}

	});
	*/

	//HANDLE REGISTER

	app.post('/api/users/register',function(req,res){

		// create a todo, information comes from AJAX request from Angular
	
		var name = req.body.name;
		var username = req.body.username;
		var password = req.body.password;
		var kt = req.body.kt;
		var email = req.body.email;


		//Check if the user is in the database
		User.findOne({username: username}, function(err,users){
			

			//if not add him
			if (err){
				res.send(err);
			}
			//username is avalable
			else if (users == undefined){

				//Get the drug data from database
				Drug_data.find(function(err, lyf_data) {

					// if there is an error retrieving, send the error. nothing after res.send(err) will execute
					if (err)
						res.send(err);
					
					//The data has been collected and insert into user database
					console.log(lyf_data[0].lyf1 + " Data frá lyf");

					console.log("Notendanafn er laust");
						User.create({
							username:username,
							password:password,
							name:name,
							kt:kt,
							email:email,
							lyf1:lyf_data[0].lyf1,
							lyf1_data:lyf_data[0].lyf1_data,
							lyf2:lyf_data[0].lyf2,
							lyf2_data:lyf_data[0].lyf2_data,
							lyf3:lyf_data[0].lyf3,
							lyf3_data:lyf_data[0].lyf3_data,
							lyf4:lyf_data[0].lyf4,
							lyf5_data:lyf_data[0].lyf4_data,
							
						}, function(err,msg){
							if(err){
								res.send(err);
								}
							res.send(200);
						});
				});		
			}

			//else return that the username is already in the database
			else{
				console.log("Username er frátekið");
				res.send(401);

			}

			});
	});


		// api ---------------------------------------------------------------------
	// get all todos
	app.post('/api/getdrugs',[express.bodyParser(), jwtauth], function(req, res) {


		//FINNA ÖLL SEM HAFA USERNAME NAFNIÐ Í DÓTINU SÝNU

		console.log(req.current_user + "her");
		// use mongoose to get all todos in the database
		Todo.find({user:req.current_user},function(err, todos) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err);
				
			console.log(todos);
			res.json(todos); // return all todos in JSON format
		});
	});

	// create todo and send back all todos after creation
	app.post('/api/insertdrugs',[express.bodyParser(), jwtauth], function(req, res) {


		Todo.update({
			id: req.body.id,
		}, 
		{$set: { 	
			day: req.body.day,
			color: req.body.color,
			graphTime: req.body.graphTime,
			stringTime: req.body.stringTime,
			checked: req.body.checked,
			visible: req.body.visible,
			show: req.body.show,
			date: req.body.date,
			id: req.body.id,
			data: req.body.data,
			amount: req.body.amount,
			name: req.body.name,
			user: req.current_user
		}
		}
		, {upsert: true}, function(err, todo) {
			if (err)
				res.send(err);
				

			// get and return all the todos after you create another
			// Todo.find(function(err, todos) {
			// 	if (err)
			// 		res.send(err);
			// 	res.json(todos);
				
			// });
		});
	});

	// delete a todo
	app.delete('/api/drugs/:todo_id', function(req, res) {
		Todo.remove({
			id : req.params.todo_id
		}, function(err, todo) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			// Todo.find(function(err, todos) {
			// 	if (err)
			// 		res.send(err);
			// 	res.json(todos);
			// });
		});
	});



	

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});

	
};