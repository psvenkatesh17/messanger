'use strict';

var UserModel 		= require('../user/user.model');
var passport 		= require('passport');
var config 			= require('../../config/environment');
var sendRsp 		= require('../utils').sendRsp;
var log 			= require('../libs/log')(module);
var util 			= require('util');
var request 		= require('request');
var _ 				= require('lodash');
var crypto			= require('../../auth/encrypt-decrypt');
var expressJwt 		= require('express-jwt');
var validateJwt 	= expressJwt({ secret: config.secrets.accessToken });


exports.login = function(req,res,next){		
	console.log("Login");
	var params 			= req.body;
	var clientId 		= config.auth.clientId;
    var clientSecret 	= config.auth.clientSecret;
    params.grant_type 	= "password";
    //console.log("Form values :", params);
    var authCode = new Buffer(clientId+":"+clientSecret).toString('base64');
	request.post({url: config.auth.url,
		form: params,headers: {"Authorization" : "Basic "+authCode }
	},function(err,response,body){		
		if(response.statusCode == 403){
			sendRsp(res, 401,'Invalid Username or Password');
			return;
		}			
		var tokens = {};
		var rspTokens = {};
		var tokenJSON = JSON.parse(body);
		var refreshToken = tokenJSON.refresh_token;
		rspTokens.access_token = tokenJSON.access_token;
		rspTokens.expires_in = tokenJSON.expires_in;
		rspTokens.token_type = tokenJSON.token_type;

		var encryptedRefToken = crypto.encrypt(refreshToken);
				
		tokens.clientId = clientId;
		tokens.refreshToken = JSON.parse(body).refresh_token;
		
		/*UserModel.update({'username' : params.username}, {$addToSet: {tokens: tokens}}, function(err,  numAffected) {
			if (err) {
				log.error('Internal error(%d): %s', res.statusCode, err.message);
				return sendRsp(res, 500, 'Server error');
			}				
		});*/			
		res.cookie("ioc_refresh_token",encryptedRefToken);
		sendRsp(res, 200,'Success',rspTokens);			
	});	
};


exports.refreshToken = function(req,res,next){	
	console.log("refreshToken :", req.cookies.ioc_refresh_token);	
	var decryptedRefToken = crypto.decrypt(req.cookies.ioc_refresh_token);
	console.log("decryptedRefToken :", decryptedRefToken);	
	UserModel.find({"username" : req.body.username},function(err,user){	
		if(user.length > 0){				
			var tokens = user[0].tokens;
			//console.log("tokens :", tokens);			
			var flag = false;
			for (var i = 0; i < tokens.length; i++) {					
				if(tokens[i].refreshToken === decryptedRefToken) {					
					flag = true;
				}
			}
			if(!flag) {
				sendRsp(res, 403, "Refesh token mismatched");
				return;
			}
			var params = {};
			params.refresh_token = decryptedRefToken;
			var clientId 		= config.auth.clientId;
   	 		var clientSecret 	= config.auth.clientSecret;
		    params.grant_type	= "refresh_token";

		    var authCode = new Buffer(clientId+":"+clientSecret).toString('base64');		    

			request.post({url: config.auth.url,
				form: params,headers: {"Authorization" : "Basic "+authCode }
			},function(err,response,body){									
				sendRsp(res, 200,'Success',JSON.parse(body));
			});	
		}else{
			res.clearCookie('ioc_refresh_token');
			sendRsp(res, 403, "user not found");
		}		

		
	});		
};


exports.logout = function(req,res,next){

	var refToken = crypto.decrypt(req.cookies.ioc_refresh_token);
	res.clearCookie('ioc_refresh_token');
	UserModel.update({'_id':req.user._id}, {$pull: {tokens: {"refreshToken": refToken}}},function(err,result){
		if(!err){
			sendRsp(res, 200, "logout successfully");	
		}else{
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			return sendRsp(res, 500, 'Server error');
		}
	});
	
};	