var User = require('./models/user');
var jwt = require('jwt-simple');
var secret = require('../config/secret');
 
module.exports = function(req, res, next) {
  
	//Náum í token
  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
 	

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

	//let the dude know what user is logged in

	User.findOne({ _id: decoded.iss }, function(err, user) {


  		req.current_user = decoded.iss
 
  		next();
	});
	
};