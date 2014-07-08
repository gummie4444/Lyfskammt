//module for database

//_________ TODO CHANGE FOR OUR DATABASE

var mongoose = require('mongoose');

module.exports = mongoose.model('Todo', {
	text : String,
	done : Boolean
});