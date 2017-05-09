"use strict"

const url = require('url');
const db = require('./simpledb-interface.js');

function addRESTLog(request, response, parameters) {
	let result = addLog(parameters);
	if(result.error) {
		failRequest(response, result.reason);
	} else {
		response.writeHead(200, { 'Content-Type': 'text/plain' });
		response.end("OK");
	}
}

function addLog(parameters) {
	if(typeof parameters.id != "string") {
		return {error:true, reason: 'Invalid id'};
	}

	if(typeof parameters.data != 'string') {
		return {error:true, reason: 'Invalid data'};
	}

	let insertableLog = {
		loggerId : parameters.id,
		time : +Date.now(),
		data : parameters.data
	}
	let logPoint = db.getLogPoint(insertableLog.loggerId);

	if(logPoint.length != 1) {
		return {error:true, reason: 'Logger id does not exist'};
	}
	db.createLog(insertableLog);
	return {error:false};
}

function getLogs(request, response, parameters) {
	if(typeof parameters.id != "string") {
		failRequest(response, "Invalid id");
		return;
	}

	if(!parameters.start_intervall) {
		let oneWeek = new Date();
		oneWeek.setDate(oneWeek.getDate() - 7);
		parameters.start_intervall = oneWeek.getTime();
	} else {
		parameters.start_intervall = Number(parameters.start_intervall);
	}

	let logs = db.getLogs(parameters.id, parameters.start_intervall)
	.map(function(current) {
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
		'POST': addRESTLog
	};
}

exports.getRequestHandler = getRequestHandler;
exports.addLog = addLog;