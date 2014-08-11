var User = require('./models/user');
var jwt = require('jwt-simple');
var secret = require('../config/secret');

//MIDDLEWARE:
  /*

    Backend check if the user is allowed for the HTTP request

  */
 
module.exports = function(req, res, next) {

  console.log(req.body.access_token);  
	//Get the token
  var token = (req.body && req.body.access_token) || req.headers['x-access-token'];
 	

  //If the token exists
  if (token) {
  try {

  	//Decode the token
    var decoded = jwt.decode(token, secret.secretToken);
    // handle token here
 
  	} catch (err) {
    	res.end(err,500);
  	}
	} else {
  		next();
	}

	//check if the user is still logged in
	if (decoded.exp <= Date.now()) {
  		res.end('Access token has expired', 400);
	};

	//let the reqest know what user is logged in

	User.findOne({ _id: decoded.iss }, function(err, user) {

  		req.current_user = decoded.iss
  		next();
	});
	
};