//Mongoose models
var Drug = require('./models/drug');
var User = require ('./models/user');
var Drug_data = require('./models/drug_data');

//Dependencies
var jwt = require('jwt-simple');
var express  = require('express');
var secret = require('../config/secret');
var jwtauth = require('./jwtauth.js');
var moment = require('moment');


module.exports = function(app) {

	//ROUTING:
	/*

		Routes for api calls from angular

	*/

//API FOR USERS
	//---------------------------------------------------


	//HANDLE LOGINS
	//TODO: USERINTERFACE
	app.post('/api/users',function(req,res){

		var username = req.body.username ;
   		var password = req.body.password ;

		User.findOne({username: username}, function(err,users){

			if(err){
				console.log(err + "VIlla1");
				//eitthver villa
				return res.send(401);
			}
			
			if(users == undefined){
				console.log(err + "VIlla2");

				//vitlaust notendanafn
				return res.send(401);
			}

			users.comparePassword(password, function(isMatch){
				if (!isMatch){
					//password vitlaust
					console.log("Attempt failed to login with: " + users.username);
					return res.send(401);
				}
				
		

				//TODO SET THE AMOUNT THE USER CAN STAY ON

				var expires = moment().add(1,'days').valueOf();

				var token = jwt.encode({iss: users._id,
										exp:expires
										}, secret.secretToken);
										
				return res.json({token:token});
				
			});

			
		})


	});

	//HANDLE REGISTER
	//TODO:USER INTERFACE

	app.post('/api/users/register',function(req,res){
	
		var name = req.body.name;
		var username = req.body.username;
		var password = req.body.password;
		var kt = req.body.kt;
		var email = req.body.email;


		//Check if the user is in the database
		User.findOne({username: username}, function(err,users){
			
			
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
							lyf4_data:lyf_data[0].lyf4_data,
							
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
//---------------------------------------------------

//API FOR DRUG_DATA
	//---------------------------------------------------
		
	//Get the drugs the user has in his document
	//TODO: AMOUNT?????
	app.post('/api/drug_data',[express.bodyParser(), jwtauth], function(req, res) {

		User.findOne({_id: req.current_user}, function(err,users){

			if(err){
				console.log(err + "VIlla1");
				//eitthver villa
				return res.send(401);
			}
			
			res.send([ 
			{ 
				name : users.lyf1, 
				amount: "2 mg",
				data: users.lyf1_data,
				color: "#f1c40f" // yellow
			},  
			{ 
				name : users.lyf2, 
				amount: "4 mg",
				data: users.lyf2_data,
				color: "#27ae60" // green
			},  
			{ 
				name : users.lyf3, 
				amount: "2 mg",
				data: users.lyf3_data,
				color: "#c0392b" // red
			},
			{ 
				name : users.lyf4, 
				amount: "3 mg",
				data: users.lyf4_data,
				color: "#3498db" // blue
			}]
			);
		});


	});
	//---------------------------------------------------

//API FOR DRUGS
	//---------------------------------------------------

	// Get the drugs that the user ownes
	app.post('/api/drugs',[express.bodyParser(), jwtauth], function(req, res) {


		//FINNA ÖLL SEM HAFA USERNAME NAFNIÐ Í DÓTINU SÝNU
		// use mongoose to get all the info about this user in the database
		Drug.find({user:req.current_user},function(err, drugs) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err);
				
			res.json(drugs); // return all todos in JSON format
		});
	});

	// Update or create a new drug instance
	app.post('/api/insertdrugs',[express.bodyParser(), jwtauth], function(req, res) {


		Drug.update({
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
		, {upsert: true}, function(err, temp) {
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

	// Deleta a drug instance
	app.delete('/api/drugs/:drug_id', function(req, res) {
		Drug.remove({
			id : req.params.drug_id
		}, function(err, temp) {
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