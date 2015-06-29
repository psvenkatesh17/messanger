/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /users              ->  index
 * POST    /users              ->  create
 * GET     /users/:id          ->  show
 * PUT     /users/:id          ->  update
 * DELETE  /users/:id          ->  destroy
 */
'use strict';

var MessageModel 		= require('./message.model');
var passport 			= require('passport');
var config 				= require('../../config/environment');
var sendRsp   			= require('../utils').sendRsp;
var log        			= require('../libs/log')(module);
var util				= require('util');
var async				= require('async');
var ObjectId 			= require('mongoose').Types.ObjectId;


var globalLimit = config.globalRowsLimit;

// Stats of Messages
exports.stats = function(req, res) {
	console.log("receiver:", req.query.receiver);
	var queryObj = {};
	var resultObj = {};
	if(req.query.receiver) {
		queryObj.receiver = new ObjectId(req.query.receiver);
	}
	async.parallel([
		// Total messages count
		function(callback) {
			MessageModel.count(queryObj, function (err, count) {
				resultObj.total = count;
				callback(null, count);
			});
		},
		function(callback) {
			MessageModel.aggregate([
				{"$match" : queryObj},
				{"$group" : {
							"_id" : "$status",
							"count" : {$sum:1}
							}
				}
			], function (err, statusCount) {
				console.log("statusCount:", statusCount);
				resultObj.statusCount = statusCount;
				callback(null, statusCount);
			});
		}
	], function (err, result) {
		if(!err) {
			sendRsp(res, 200, 'OK', {stats : resultObj});
		}
	});
};

// List of Messages
exports.index = function(req, res) {
	var queryObj = {};
	if(req.query.receiver) {
		queryObj.receiver = req.query.receiver;
	}

	var messageLimit = req.query.limit;
	var messageOffset = req.query.offset;
	var messageSort = { '_id' : 1 };

	if (messageLimit < 0 || messageLimit > globalLimit) {
		messageLimit = globalLimit;
	}

	MessageModel.find(queryObj, null, {
	limit : messageLimit,
	skip : messageOffset,
	sort : messageSort})
	.populate('sender')
	.populate('receiver')
	.exec(function (err, messages) {
		if(!err) {
			MessageModel.count(queryObj, function (err, count) {
				var total = err ? 'N/A' : count;
				sendRsp(res, 200, 'OK', {total: total, messages: messages});
			});
		} else {
			sendRsp(res, 500, 'Server error');
		}
	});
};

// Create new Message
exports.create = function(req, res) {
	/*if(!req.body.sender) {
		sendRsp(res, 400, 'Missing Param', 'Sender field Missing');
	}*/
	if(!req.body.receiver) {
		sendRsp(res, 400, 'Missing Param', 'Receiver field Missing');
	}
	//req.checkBody('status', 'Missing Param').notEmpty();
	var errors = req.validationErrors();
	if(errors) {
		sendRsp(res, 400, 'Missing Param', util.inspect(errors));
		return;
	}

	var newMessage = new MessageModel({
		sender : "558a4277e4dd3c201808081f",
		receiver : req.body.receiver,
		message : req.body.msg,
		status : req.body.status ? req.body.status : "UNREAD"
	});

	newMessage.save(function (err, message) {
		console.log("err:",err);
		if(!err) {
			sendRsp(res, 201, 'Created', {message: message});
		} else {
			if(err.name === 'ValidationError') {
            	sendRsp(res, 400, 'Validation error');
            } else if (err.name === 'SenderUserNotFound') {
				sendRsp(res, 404, 'Sender Not Found');
			} else if (err.name === 'ReceiverUserNotFound') {
				sendRsp(res, 404, 'Receiver Not Found');
			} else {
            	sendRsp(res, 500, 'Server error');
            }
		}
	});
};

// Show Message
exports.show = function(req, res) {
	var messageId = req.params.id;
	console.log("messageId:", messageId);
	MessageModel.findById(messageId, function (err, message) {
		if(!message) {
			sendRsp(res, 404, 'Not Found');
		} else {
			sendRsp(res, 200, 'OK', {message: message});
		}
	});
};

// Update Messages
exports.update = function(req, res) {

};

// Delete Messages
exports.destroy = function(req, res) {
	var messageId = req.params.id;
	MessageModel.findById(messageId, function (err, message) {
		if(!err) {
			message.remove(function (err) {
				if(!err) {
					sendRsp(res, 200, 'Deleted', {message: message});
				} else {
					sendRsp(res, 500, 'Server error');
				}
			});
		} else {
			sendRsp(res, 404, 'Not Found');
		}
	});
};

// Delete multiple Messages
exports.deleteMultiple = function(req, res) {
	var messageIds = req.params.ids;
	MessageModel.remove({_id:{$in:messageIds}}, function (err) {
		if(!err) {
			sendRsp(res, 200, 'Messages Removed');
		} else {
			sendRsp(res, 500, 'Server error');
		}
	});
};