"use strict"

const url = require('url');
const db = require('./simpledb-interface.js');
const VALID_CSS_COLOR = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;

function createLogPoint(request, response, parameters) {
	if(typeof parameters.id != "string") {
		failRequest(response, "Invalid id");
		return;
	}

	if(!parameters.description) {
		parameters.description = '';
	} else if(typeof parameters.description != 'string') {
		failRequest(response, "Invalid description");
		return;
	}

	if(!parameters.color) {
		parameters.color = '#000000';
	} else if(typeof parameters.color != 'string') {
		failRequest(response, 'Invalid color');
		return;
	} else if(!VALID_CSS_COLOR.test(parameters.color)) {
		failRequest(response, 'Invalid color');
		return;
	}

	let insertableLogPoint = {
		loggerId : parameters.id,
		time : +Date.now(),
		description : parameters.description,
		color : parameters.color
	}

	let logPoint = db.getLogPoint(insertableLogPoint.loggerId);
	if(logPoint.length == 0) {
		db.createLogPoint(insertableLogPoint);
		response.writeHead(200, { 'Content-Type': 'text/plain' });
		response.end("OK");
	} else {
		failRequest(response, "Logger id already exists");
	}

}

function getLogPoint(request, response, parameters) {
	if(!!parameters.id && typeof parameters.id != "string") {
		failRequest(response, "Invalid id");
		return;
	}

	let logPoints = db.getLogPoint(parameters.id).map(function(current) {
		return {
			loggerId : current.loggerId,
			time : current.time,
			description : current.description,
			color : current.color
		};
	});
	response.writeHead(200, { 'Content-Type': 'application/json' });
	response.end(JSON.stringify(logPoints));

}

function updateLogPoint(request, response, parameters) {
	if(typeof parameters.id != "string") {
		failRequest(response, "Invalid id");
		return;
	}

	if(typeof parameters.description != 'string') {
		failRequest(response, "Invalid description");
		return;
	}

	if(typeof parameters.color != 'string') {
		failRequest(response, 'Invalid color');
		return;
	} else if(!VALID_CSS_COLOR.test(parameters.color)) {
		failRequest(response, 'Invalid color');
		return;
	}

	let insertableLogPoint = {
		loggerId : parameters.id,
		description : parameters.description,
		color : parameters.color
	}

	db.updateLogPoint(insertableLogPoint);
	response.writeHead(200, { 'Content-Type': 'text/plain' });
	response.end("OK");
}

function deleteLogPoint(request, response, parameters) {
	if(typeof parameters.id != "string") {
		failRequest(response, "Invalid id");
		return;
	}

	db.deleteLogPoint(parameters.id);
	response.writeHead(200, { 'Content-Type': 'text/plain' });
	response.end("OK");
}

function failRequest(response, reason) {
	response.writeHead(748, { 'Content-Type': 'text/plain' });
	response.end(reason);
}

function getRequestHandler() {
	return {
		'GET':getLogPoint,
		'POST': createLogPoint,
		'PUT': updateLogPoint,
		'DELETE': deleteLogPoint
	};
}

exports.getRequestHandler = getRequestHandler;