"use strict"

const url = require('url');
const mongoInterface = require('./mongo-interface.js');

function addLog(request, response, parameters) {
	if(!typeof parameters.id == "string") {
		failRequest(response, "Invalid id");
		return;
	}

	if(!(typeof parameters.data == 'string')) {
		failRequest(response, "Invalid data");
		return;
	}

	let insertableLog = {
		loggerId : parameters.id,
		time : Date.now(),
		data : parameters.data
	}
	mongoInterface.getLogPoint(insertableLog.loggerId)
	.then(function(result) {
		if(result.length == 1) {
			mongoInterface.createLog(insertableLog)
			.then(function() {
				response.writeHead(200, { 'Content-Type': 'text/plain' });
				response.end("OK");
			})
			.catch(function() {
				failRequest(response, "Something broke in mongodb");
			});
		} else {
			failRequest(response, "Logger id does not exist");
		}
	}).catch(function() {
		failRequest(response, "Something broke in mongodb");
	});
}

function getLogs(request, response, parameters) {
	if(!typeof parameters.id == "string") {
		failRequest(response, "Invalid id");
		return;
	}

	mongoInterface.getLogs({'loggerId' : parameters.id})
	.then(function(result) {
		let presentableResult = result.map(function(current) {
			return {
				time : current.time,
				data : current.data
			};
		});
		response.writeHead(200, { 'Content-Type': 'application/json' });
		response.end(JSON.stringify(presentableResult));
	})
	.catch(function() {
		failRequest(response, "Something broke in mongodb");
	});
}

function failRequest(response, reason) {
	response.writeHead(748, { 'Content-Type': 'text/plain' });
	response.end(reason);
}

function getRequestHandler() {
	return {
		'GET':getLogs,
		'POST': addLog
	};
}

exports.getRequestHandler = getRequestHandler;