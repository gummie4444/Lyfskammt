//SCHEMA for the usern document
//TODO Salt the passwords

var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var userSchema = new Schema ({
	name:{type:String,required:true},
	username:{ type:String, required: true, unique: true},
	password:{ type:String, required: true},
	kt:{type:String,required:true},
	email:{type:String,required:true},
	created: { type: Date, default: Date.now },
	preferedDrugs:{type:Array}

});


//inner function for compering passwords
userSchema.methods.comparePassword = function(password,cb){
	console.log("password: " + password + " this.password: " + this.password);
	if(password === this.password){

		
		cb(true);

	}
	else{
		cb(false);
	}

};

module.exports = mongoose.model('User',userSchema);