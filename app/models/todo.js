//module for database

//_________ TODO CHANGE FOR OUR DATABASE

var mongoose = require('mongoose');

module.exports = mongoose.model('Drug', {
	day: String,
	color: String,
	graphTime: String,
	stringTime: String,
	id: String,
	data: Array,
	amount: String,
	name: String
});