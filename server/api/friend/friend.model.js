'use strict';

var mongoose = require('mongoose');
var UserModel	= require('../user/user.model');
var Schema = mongoose.Schema;

// Friend Schema
var FriendSchema = new Schema({
  user      : {type: Schema.Types.ObjectId, ref:'User', required : true}, // login person
  friend   	: {type: Schema.Types.ObjectId, ref: 'User'}
});

var FriendModel = mongoose.model('Friend', FriendSchema);
module.exports = FriendModel;