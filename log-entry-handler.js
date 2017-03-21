"use strict"

const url = require('url');
const db = require('./simpledb-interface.js');

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
	let logPoint = db.getLogPoint(insertableLog.loggerId);

	if(logPoint.length == 1) {
		db.createLog(insertableLog);
		response.writeHead(200, { 'Content-Type': 'text/plain' });
		response.end("OK");
	} else {
		failRequest(response, "Logger id does not exist");
	}
}

function getLogs(request, response, parameters) {
	if(!typeof parameters.id == "string") {
		failRequest(response, "Invalid id");
		return;
	}

	let logs = db.getLogs(parameters.id).map(function(current) {
		return {
			time : current.time,
			data : current.data
		};
	});
	response.writeHead(200, { 'Content-Type': 'application/json' });
	response.end(JSON.stringify(logs));
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