/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /users              ->  index
 * POST    /users              ->  create
 * GET     /users/:id          ->  show
 * PUT     /users/:id          ->  update
 * DELETE  /users/:id          ->  destroy
 */
'use strict';

var UserModel 			= require('./user.model');
var passport 			= require('passport');
var config 				= require('../../config/environment');
var sendRsp   			= require('../utils').sendRsp;
var log        			= require('../libs/log')(module);
var util				= require('util');

var globalLimit = config.globalRowsLimit;

// List of users
exports.index = function(req, res) {
	var queryObj = {};
	if(req.query.email) {
		queryObj.email = req.query.email;
	}
	console.log("queryObj:", queryObj);
	var userLimit = req.query.limit;
	var userOffset = req.query.offset;
	var userSort = { '_id' : 1 };

	if (userLimit < 0 || userLimit > globalLimit) {
		userLimit = globalLimit;
	}

	UserModel.find(queryObj, null,  {
			limit : userLimit,
			skip : userOffset,
			sort : userSort
		})		
		.exec(function (err, users) {
		if(!users) {
			sendRsp(res, 404, 'Not Found');
		}
		if(!err) {
			UserModel.count(queryObj, function(err, count) {
				var total = err ? 'N/A' : count;
				sendRsp(res, 200, 'OK', {
					total : total,
					users : users
				});
			});					
		} else {
			log.error('Internal error(%d): %s',res.statusCode,err.message);
            sendRsp(res, 500, 'Server error');
		}
	});
};

// Create new user
exports.create = function(req, res) {
	req.checkBody('name', 'Missing Param').notEmpty();
	req.checkBody('username', 'Missing Param').notEmpty();
	req.checkBody('email', 'Missing Param').notEmpty();
	req.checkBody('hashed_password', 'Missing Param').notEmpty();
	req.checkBody('salt', 'Missing Param').notEmpty();
	req.checkBody('dob', 'Missing Param').notEmpty();
	req.checkBody('gender', 'Missing Param').notEmpty();
	req.checkBody('mobile', 'Missing Param').notEmpty();
	req.checkBody('address', 'Missing Param').notEmpty();
	var errors = req.validationErrors();
	if(errors) {
		sendRsp(res, 400, 'Missing Param', util.inspect(errors));
		return;
	}
	var newUser = new UserModel({
		name      		: req.body.name,
	  	username  		: req.body.username,
	  	email     		: req.body.email, 
	  	hashed_password	: req.body.hashed_password,
	  	salt			: req.body.salt,
	  	dob				: req.body.dob,
	  	gender			: req.body.gender,	
	  	mobile			: req.body.mobile,	
	  	address			: req.body.address,
	  	nationality		: req.body.nationality,
	  	state			: req.body.state,
	  	district		: req.body.district,
	  	pincode	 		: req.body.pincode,
	});
	newUser.save(function (err, user) {
		if(!err) {
			sendRsp(res, 201, 'Created', {user: user});
		} else {
			if(err.name === 'ValidationError') {
				sendRsp(res, 400, 'Validation error');
			} else {
            	sendRsp(res, 500, 'Server error');
            }
		}
	});
};

// Show single user
exports.show = function(req, res) {
	var userId = req.params.id;
	UserModel.findById(userId, function (err, user) {
		if(!user) {
			sendRsp(res, 404, 'Not Found');
		} else {
			sendRsp(res, 200, 'Ok', {user: user});
		}
	});
};

// Update user
exports.update = function(req, res) {
	req.checkBody('name', 'Missing Param').notEmpty();
	req.checkBody('username', 'Missing Param').notEmpty();
	req.checkBody('email', 'Missing Param').notEmpty();
	req.checkBody('hashed_password', 'Missing Param').notEmpty();
	req.checkBody('salt', 'Missing Param').notEmpty();
	req.checkBody('dob', 'Missing Param').notEmpty();
	req.checkBody('gender', 'Missing Param').notEmpty();
	req.checkBody('mobile', 'Missing Param').notEmpty();
	req.checkBody('address', 'Missing Param').notEmpty();
	var errors = req.validationErrors();
	if(errors) {
		sendRsp(res, 400, 'Missing Param', util.inspect(errors));
		return;
	}

	var userId = req.params.id;
	UserModel.findById(userId, function (err, user) {
		if(!err) {
			user.name = req.body.name;
			user.username = req.body.username;
		  	user.email   = req.body.email;
		  	user.hashed_password = req.body.hashed_password;
		  	user.salt = req.body.salt;
		  	user.dob = req.body.dob;
		  	user.gender	= req.body.gender;
		  	user.mobile	= req.body.mobile;
		  	user.address	= req.body.address;
		  	user.nationality = req.body.nationality;
		  	user.state = req.body.state;
		  	user.district = req.body.district;
		  	user.pincode	 = req.body.pincode;

		  	user.save(function (err) {
		  		if(!err) {
		  			sendRsp(res, 200, 'Updated', {user: user});
		  		} else {
		  			if(err.name === 'ValidationError') {
	                	sendRsp(res, 400, 'Validation error');
	                } else {
	                	sendRsp(res, 500, 'Server error');
	                }
		  		}
		  	});

		}
	});
};

// Delete user
exports.destroy = function(req, res) {
	var userId = req.params.id;
	UserModel.findById(userId, function (err, user) {
		if(!err) {
			user.remove(function (err) {
				if(!err) {
					sendRsp(res, 200, 'Deleted', {user: user});
				} else {
					sendRsp(res, 500, 'Server error');
				}
			});
		}
	});
};

// Delete multiple users
exports.deleteMultiple = function(req, res) {
	var userIds = req.params.ids;
	UserModel.remove({_id:{$in:userIds}}, function (err) {
		if(!err) {
			sendRsp(res, 200, 'Users Removed');
		} else {
			sendRsp(res, 500, 'Server error');
		}
	});
};