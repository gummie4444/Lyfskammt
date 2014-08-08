var mongoose = require('mongoose');

//SCHEMA for the drug_data document

module.exports = mongoose.model('drug_data', {

	lyf1:String,
	lyf1_data:Array,
	lyf2:String,
	lyf2_data:Array,
	lyf3:String,
	lyf3_data:Array,
	lyf4:String,
	lyf4_data:Array,
});