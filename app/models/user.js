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
	lyf1:{type:String},
	lyf2:{type:String},
	lyf3:{type:String},
	lyf4:{type:String},
	lyf1_data : { type : Array  },
	lyf2_data : { type : Array  },
	lyf3_data : { type : Array  },
	lyf4_data : { type : Array  }

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