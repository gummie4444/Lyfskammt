//SCHEMA for the caliplus document


var mongoose = require('mongoose');

module.exports = mongoose.model('Caliplus', {
	user:String,
	StartTime:String,
	id:String


});