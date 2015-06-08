var mongoose = require('mongoose');

//SCHEMA for the drug_data document

module.exports = mongoose.model('drug_data', {

	data:Array
});