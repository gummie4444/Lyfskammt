//SCHEMA for the caliplus document


var mongoose = require('mongoose');

module.exports = mongoose.model('Caliminus', {
	user:String,
	StartTime:String,
	id:String

});