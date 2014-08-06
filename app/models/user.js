//module for database

//_________ TODO CHANGE FOR OUR DATABASE

var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var userSchema = new Schema ({
	username:{ type:String, required: true, unique: true},
	password:{ type:String, required: true},
	name:{type:String,required:true},
	kt:{type:String,required:true},
	email:{type:String,required:true},
	created: { type: Date, default: Date.now }
});


//INNRA FALL TIL AÐ ATHUGA PASSWORD SÉU EINS

userSchema.methods.prufa = function(){
	return this.password;
};

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