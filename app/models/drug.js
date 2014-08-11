//SCHEMA for the drugs document


var mongoose = require('mongoose');

module.exports = mongoose.model('Drug', {
	day: String,
	color: String,
	graphTime: String,
	stringTime: String,
	checked: Boolean,
	visible: Boolean,
	show: Boolean,
	date: String,
	id: String,
	data: Array,
	access_token: String,
	amount: String,
	name: String,
	user:String
});