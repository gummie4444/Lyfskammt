//SCHEMA for the drugs document


var mongoose = require('mongoose');

module.exports = mongoose.model('Drug', {
	day: String,
	color: String,
	graphTime: String,
	stringTime: String,
	statusStartTime :String,
	statusEndTime: String,
	duration:String,
	checked: Boolean,
	visible: Boolean,
	show: Boolean,
	date: String,
	id: String,
	drugType: String,
	amount: String,
	name: String,
	user:String
});