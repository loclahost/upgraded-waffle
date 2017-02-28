"use strict"

const url = require('url');
const mongoInterface = require('./mongo-interface.js');

function addLog(request, response) {
	let urlObject = url.parse(request.url, true);
	let newLog = urlObject.query;
	if(!typeof urlObject.query.id == "string") {
		failRequest(response, "Invalid id");
		return;
	}

	if(!(typeof newLog.data == 'string')) {
		failRequest(response, "Invalid data");
		return;
	}

	let insertableLog = {
		loggerId : newLog.id,
		time : Date.now(),
		data : newLog.data
	}

	mongoInterface.createLog(insertableLog)
	.then(function() {
		response.writeHead(200, { 'Content-Type': 'text/plain' });
		response.end("OK");
	})
	.catch(function() {
		failRequest(response, "Something broke in mongodb");
	});
}

function getLogs(request, response) {
	let urlObject = url.parse(request.url, true);
	if(!typeof urlObject.query.id == "string") {
		failRequest(response, "Invalid id");
		return;
	}

	mongoInterface.getLogs({'loggerId' : urlObject.query.id})
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