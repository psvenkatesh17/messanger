/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /users              ->  index
 * POST    /users              ->  create
 * GET     /users/:id          ->  show
 * PUT     /users/:id          ->  update
 * DELETE  /users/:id          ->  destroy
 */
'use strict';

var FriendModel 		= require('./friend.model');
var passport 			= require('passport');
var config 				= require('../../config/environment');
var sendRsp   			= require('../utils').sendRsp;
var log        			= require('../libs/log')(module);
var util				= require('util');

var globalLimit = config.globalRowsLimit;
// List of friends
exports.index = function(req, res) {
	var queryObj = {};
	if(req.query.user) {
		queryObj.user = req.query.user;	
	}
	console.log("queryObj:", queryObj);

	var friendLimit = req.query.limit;
	var friendOffset = req.query.offset;
	var friendSort = { '_id' : 1 };

	if (friendLimit < 0 || friendLimit > globalLimit) {
		friendLimit = globalLimit;
	}

	FriendModel.find(queryObj, null, {
	limit : friendLimit,
	skip : friendOffset,
	sort : friendSort})
	.populate("friend")
	.exec(function (err, friends) {
		if(!err) {
			FriendModel.count(queryObj, function (err, count) {
				var total = err ? 'N/A' : count;
				sendRsp(res, 200, 'OK', {total: total, friends: friends});
			});
		} else {
			sendRsp(res, 500, 'Server error');
		}
	});
};

// Create friend
exports.create = function(req, res) {
	console.log("Body:", req.body);
	if(!req.body.friend) {
		sendRsp(res, 400, 'Missing Param', 'Friend field Missing');
	}
	if(!req.body.user) {
		sendRsp(res, 400, 'Missing Param', 'User field Missing');
	}
	var newFriend = FriendModel({
		user : req.body.user,
		friend : req.body.friend
	});
	newFriend.save(function (err, friend) {
		if(!err) {
			sendRsp(res, 201, 'Created', {friend: friend});
		} else {
			sendRsp(res, 500, 'Server error');
		}
	});
};

// Show friend
exports.show = function(req, res) {
	var friendId = req.params.id;
	FriendModel.findById(friendId, function (err, friend) {
		if(!friend) {
			sendRsp(res, 404, 'Not Found');
		} else {
			sendRsp(res, 200, 'OK', {friend: friend});
		}
	});
};

// Update friend
exports.update = function(req, res) {
	var friendId = req.params.id;
	console.log("friendId:", friendId);
	FriendModel.findById(friendId, function (err, friend) {
		if(!err) {
			friend.user = req.body.user;
			friend.friend = req.body.friend;

			friend.save(function (err) {
				if(!err) {
					sendRsp(res, 200, 'Updated', {friend: friend});
				} else {
					sendRsp(res, 500, 'Server error');
				}
			});
		}
	});
};

// Delete friend 
exports.destroy = function(req, res) {
	var friendId = req.params.id;
	FriendModel.findById(friendId, function (err, friend) {
		if(!err) {
			friend.remove(function (err) {
				if(!err) {
					sendRsp(res, 200, 'Deleted', {friend: friend});
				} else {
					sendRsp(res, 500, 'Server error');
				}
			});
		} else {
			sendRsp(res, 404, 'Not Found');
		}
	});
};

// Delete multiple friends 
exports.deleteMultiple = function(req, res) {
	var friendIds = req.params.ids;
	FriendModel.remove({_id:{$in:friendIds}}, function (err) {
		if(!err) {
			sendRsp(res, 200, 'Friends Removed');
		} else {
			sendRsp(res, 500, 'Server error');
		}
	});
};