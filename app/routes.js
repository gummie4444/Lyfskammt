	//Mongoose models
var Drug = require('./models/drug');
var User = require ('./models/user');
var Drug_data = require('./models/drug_data');

var Caliplus = require('./models/caliplus');
var Caliminus = require('./models/caliminus');

//Dependencies
var jwt = require('jwt-simple');
var express  = require('express');
var secret = require('../config/secret');
var jwtauth = require('./jwtauth.js');
var moment = require('moment');
//Initialize a REST client in a single line:
var client = require('twilio')('AC24af3292ec93f9276853cd7decb3bcf8', '9b15c0c4955b445482b952e3957eff75');
 
var sortable = [];

//ATH HVORT AD SHIT EIGI AD VERA
getDrugs(Mesort);

//Find all the drugs from now untill the next hour
function getDrugs(callback){
		console.log("Er ad tjekka");
		date = moment().valueOf();

		Drug.find({"graphTime": {"$gte": date, "$lt": date+3600000}},
			function(err,drugs){
			
				
  				if (err){
  					return callback("error");
  				}

  				else if (drugs[0] !== undefined){
  					return callback(drugs);
  				}
  				else{
  					return callback("Enginn");
  				}

  		});		
};

//Sort the drugs in accending order
function Mesort(array){

	if (array == "Enginn")
	{
		sortable = [];
	}
	else if (array == "error"){
		sortable = [];
		console.log("villa a server");
	}
	else{
		//TODO BÆTA VIÐ USERNAME
		sortable = [];
		for (var i in array){
	      sortable.push([array[i].graphTime, array[i].amount,array[i].name])
		  sortable.sort(function(a, b) {return a[0] - b[0]})

		 }
		 console.log("sortable:" + sortable)
	}
}

//Send a text msg to the number
function sendSms(time,user,drug){
	console.log("kominn i sms")
		var msg = "TAKTU LYFIÐ ÞITT";
		console.log(msg);
		client.sendSms({
		    to:'+3547728426',
		    from:'+14132415085',
		    body: msg
		}, function(error, message) {
		    if (!error) {
		        console.log('Success! The SID for this SMS message is:');
		        console.log(message.sid);
		        console.log('Message sent on:');
		        console.log(message.dateCreated);
		        //tökum fyrsta stakið út
				sortable.shift();
				check(sendSms);
		    } else {
		        console.log('Oops! There was an error.');
		        console.log(error);
		    }
		});
}

//Check if the drug is due
function check(callback){

	//ef fyrsta tímastakkið í fylkinu er
	//á eftir núverandi tíma sendu sms
	//og athugaðu næsta stak
	current_time = moment().valueOf();

		if(typeof sortable !== 'undefined' && sortable.length > 0){
			console.log("tímamismunur er : " + (current_time-sortable[0][0]));

			 if(sortable[0][0]<current_time){

				console.log("sendi sms Með upplýsingum");
				callback(sortable[0][0],sortable[0][1],sortable[0][2]);
			
			}
			else{
				console.log("enginn gæji á þessum tíma")
				
			}
		}
	console.log("dotid er undefined")
	
};



//athugum á mínotu fresti
var CronJob = require('cron').CronJob;
new CronJob('*/1 * * * *', function(){

	if(typeof sortable !== 'undefined' && sortable.length > 0){
		 check(sendSms);
	}
	 	console.log('min fresti');	  	
}, null, true, "UTC");



module.exports = function(app) {

	//ROUTING:
	/*

		Routes for api calls from angular

	*/

//API FOR Calibrate
	//---------------------------------------------------

	app.post('/api/cal_plus',[express.bodyParser(), jwtauth],function(req,res){

		Caliplus.update({
			id: req.body.index,
		}, 
		{$set: { 	
			user:req.current_user,
			StartTime:req.body.current_date,
			id:req.body.index,
		}
		}
		, {upsert: true}, function(err, temp) {
			if (err)
				res.send(err);
			
			res.send(200);
		});
	});
		

	app.post('/api/cal_minus',[express.bodyParser(), jwtauth],function(req,res){

		Caliminus.update({
			id: req.body.index,
		}, 
		{$set: { 	
			user:req.current_user,
			StartTime:req.body.current_date,
			id:req.body.index,
		}
		}
		, {upsert: true}, function(err, temp) {
			if (err)
				res.send(err);
			
			res.send(200);
		});
	});

	app.get('/api/get_cal_plus',[express.bodyParser(),jwtauth],function(req,res){

		Caliplus.find({user:req.current_user},function(err, plus_cal) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err);
			
			//maby only return today
			res.json(plus_cal); // return all plus_cal in JSON format
		});

	});

	app.get('/api/get_cal_minus',[express.bodyParser(),jwtauth],function(req,res){



		Caliminus.find({user:req.current_user},function(err, minus_cal) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err);
			
			//maby only return today
			res.json(minus_cal); // return all plus_cal in JSON format
		});

	});


	app.delete('/api/del_cal_plus/:drug_id', function(req, res) {


		Caliplus.remove({
			id : req.params.drug_id
		}, function(err, temp) {
			if (err)
				res.send(err);
			res.send(200);
			// get and return all the todos after you create another
			// Todo.find(function(err, todos) {
			// 	if (err)
			// 		res.send(err);
			// 	res.json(todos);
			// });
		});
	});

	app.delete('/api/del_cal_minus/:drug_id', function(req, res) {


		Caliminus.remove({
			id : req.params.drug_id
		}, function(err, temp) {
			if (err)
				res.send(err);
			res.send(200);
			// get and return all the todos after you create another
			// Todo.find(function(err, todos) {
			// 	if (err)
			// 		res.send(err);
			// 	res.json(todos);
			// });
		});
	});


//API FOR USERS
	//---------------------------------------------------

	//HANDLE LOGINS
	//TODO: USERINTERFACE

	app.get('/api/users/reg', function(req, res) {

		// use mongoose to get all todos in the database
		User.find(function(err, users) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			var userArray = [];
			for(var i in users){
				userArray.push(users[i].username);
				
			}

			res.send(userArray); // return all todos in JSON format
		});
	});

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
				return res.send({ "answer": 1 });
			}

			users.comparePassword(password, function(isMatch){
				if (!isMatch){
					//password vitlaust
					console.log("Attempt failed to login with: " + users.username);
					return res.send({ "answer": 2 });
				}
				
		

				//TODO SET THE AMOUNT THE USER CAN STAY ON

				var expires = moment().add(1,'days').valueOf();

				var token = jwt.encode({iss: users._id,
										exp:expires,
										user: users.username
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
						return	res.send({"answer": 1 });
						});
				});		
			}

			//else return that the username is already in the database
			else{
				console.log("Username er frátekið");
				return res.send({ "answer": 2 });

			}

			});
	});
//---------------------------------------------------

//API FOR DRUG_DATA
	//---------------------------------------------------
		
	//Get the drugs the user has in his document
	//TODO: AMOUNT?????
	app.get('/api/drug_data',[express.bodyParser(), jwtauth], function(req, res) {

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
				color: "#f1c40f", // yellow,
				duration: 6
			},  
			{ 
				name : users.lyf2, 
				amount: "4 mg",
				data: users.lyf2_data,
				color: "#27ae60", // green
				duration: 6
			},  
			{ 
				name : users.lyf3, 
				amount: "2 mg",
				data: users.lyf3_data,
				color: "#c0392b", // red
				duration: 6
			},
			{ 
				name : users.lyf4, 
				amount: "3 mg",
				data: users.lyf4_data,
				color: "#3498db", // blue
				duration: 6
			}]
			);
		});


	});
	//---------------------------------------------------

//API FOR DRUGS
	//---------------------------------------------------

	// Get the drugs that the user ownes
	app.get('/api/drugs',[express.bodyParser(), jwtauth], function(req, res) {


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

		//update the thing
		getDrugs(Mesort);


		Drug.update({
			id: req.body.id,
		}, 
		{$set: { 	
			day: req.body.day,
			color: req.body.color,
			graphTime: req.body.graphTime,
			stringTime: req.body.stringTime,
			statusStartTime:req.body.statusStartTime,
			statusEndTime:req.body.statusEndTime,
			duration:req.body.duration,
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
			
			res.send(200);
		});
	});

	// Deleta a drug instance
	app.delete('/api/drugs/:drug_id', function(req, res) {
		//update the thing
		getDrugs(Mesort);

		Drug.remove({
			id : req.params.drug_id
		}, function(err, temp) {
			if (err)
				res.send(err);
			res.send(200);
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