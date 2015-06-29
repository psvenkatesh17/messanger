'use strict';

var mongoose = require('mongoose');
var UserModel	= require('../user/user.model');
var Schema = mongoose.Schema;

// Message Schema
var MessageSchema = new Schema({
  	sender		: {type: Schema.Types.ObjectId, ref:'User', required : true}, // login person
	receiver	: {type: Schema.Types.ObjectId, ref:'User', required : true},
	message		: {type: String},
	status		: {type: String, enum:['READ','UNREAD'],required: true, default: 'UNREAD'} 	
});

/*MessageSchema.pre('save', function(next) {
	var senderId = this.sender;	
	var receiverId = this.receiver;
	console.log("senderId:", senderId);
	console.log("recevierId:", receiverId);
	
	UserModel.find({'_id':{ $in: senderId}}, function (err, sender) {
		if(err) {			
			next(err);
		}
		if(!sender) {			
			var error = new Error('SenderUserNotFound');
			error.name = 'SenderUserNotFound';
			next(error);
		}			
		//next();
		UserModel.find({'_id':{ $in: receiverId}}, function (err, receiver) {
			if(err) {			
				next(err);
			}
			if(!receiver) {			
				var error = new Error('ReceiverUserNotFound');
				error.name = 'ReceiverUserNotFound';
				next(error);
			}
			next();	
		});
	});
});*/

var MessageModel = mongoose.model('Message', MessageSchema);
module.exports = MessageModel;

