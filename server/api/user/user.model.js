'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// User Schema
var UserSchema = new Schema({
  	name      		: {type: String, index : true, required : true},
  	username  		: {type: String, unique : true,required : true},
  	email     		: {type: String, unique : true,required : true}, 
  	hashed_password	: {type: String, required: true},
  	salt			: {type: String, required: true},
  	dob				: {type: Date, required: true, index: true},
  	gender			: {type: String, enum:['MALE','FEMALE'],required: true, index: true},	
  	mobile			: {type: String, required: true, index: true},	
  	address			: {type: String, required: true, index: true},
  	image_url		: {type: String}
});

UserSchema.index({email: 1}, {unique: true});

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
	this._password = password;
	this.salt = this.makeSalt();
	//console.log("user: ", this);
	this.hashed_password = this.encryptPassword(password);
}).get(function() {
	return this._password;
});

var validatePresenceOf = function(value) {
	return value && value.length;
};

// Validate empty username
UserSchema.path('username').validate(function(username) {
	return username.length;
}, 'Username cannot be blank');

// Validate empty password
UserSchema.path('hashed_password').validate(function(hashed_password) {
	console.log("Hashed pwd:",hashed_password);
	return hashed_password.length;
}, 'Password cannot be blank');

/**
 * Methods
 */
UserSchema.methods = {
	/**
	 * Authenticate - check if the passwords are the same
	 * 
	 * @param {String}
	 *            plainText
	 * @return {Boolean}
	 * @api public
	 */
	authenticate : function(plainText) {
		return this.encryptPassword(plainText) === this.hashed_password;
	},

	/**
	 * Make salt
	 * 
	 * @return {String}
	 * @api public
	 */
	makeSalt : function() {
		return crypto.randomBytes(16).toString('base64');
	},

	/**
	 * Encrypt password
	 * 
	 * @param {String}
	 *            password
	 * @return {String}
	 * @api public
	 */
	encryptPassword : function(password) {
		if (!password || !this.salt)
			return '';
		var saltWithEmail = new Buffer(this.salt + this.username.toString('base64'), 'base64');
		return crypto.pbkdf2Sync(password, saltWithEmail, 10000, 64).toString('base64');
	}
};


var UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;