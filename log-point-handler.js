"use strict"

const url = require('url');
const mongoInterface = require('./mongo-interface.js');

function createLogPoint(request, response, parameters) {
	if(!typeof parameters.id == "string") {
		failRequest(response, "Invalid id");
		return;
	}

	if(!parameters.description) {
		parameters.description = '';
	} else if(!(typeof parameters.description == 'string')) {
		failRequest(response, "Invalid description");
		return;
	}

	let insertableLogPoint = {
		loggerId : parameters.id,
		time : Date.now(),
		description : parameters.description
	}

	mongoInterface.getLogPoint(insertableLogPoint.loggerId)
	.then(function(result) {
		if(result.length == 0) {
			mongoInterface.createLogPoint(insertableLogPoint)
			.then(function() {
				response.writeHead(200, { 'Content-Type': 'text/plain' });
				response.end("OK");
			});
		} else {
			failRequest(response, "Logger id already exists");
		}
	})
	.catch(function(err) {
		console.log(err);
		failRequest(response, "Something broke in mongodb");
	});
}

function getLogPoint(request, response, parameters) {
	if(!!parameters.id && !typeof parameters.id == "string") {
		failRequest(response, "Invalid id");
		return;
	}

	mongoInterface.getLogPoint(parameters.id)
	.then(function(result) {
		let presentableResult = result.map(function(current) {
			return {
				loggerId : current.loggerId,
				time : current.time,
				description : current.description
			};
		});
		response.writeHead(200, { 'Content-Type': 'application/json' });
		response.end(JSON.stringify(presentableResult));
	})
	.catch(function(err) {
		console.log(err);
		failRequest(response, "Something broke in mongodb");
	});
}

function updateLogPoint(request, response, parameters) {
	if(!typeof parameters.id == "string") {
		failRequest(response, "Invalid id");
		return;
	}

	if(!(typeof parameters.description == 'string')) {
		failRequest(response, "Invalid description");
		return;
	}

	let insertableLogPoint = {
		loggerId : parameters.id,
		description : parameters.description
	}

	mongoInterface.updateLogPoint(insertableLogPoint)
	.then(function() {
		response.writeHead(200, { 'Content-Type': 'text/plain' });
		response.end("OK");
	})
	.catch(function(err) {
		console.log(err);
		failRequest(response, "Something broke in mongodb");
	});
}

function deleteLogPoint(request, response, parameters) {
	if(!typeof parameters.id == "string") {
		failRequest(response, "Invalid id");
		return;
	}

	mongoInterface.deleteLogPoint(parameters.id)
	.then(function() {
		response.writeHead(200, { 'Content-Type': 'text/plain' });
		response.end("OK");
	})
	.catch(function(err) {
		console.log(err);
		failRequest(response, "Something broke in mongodb");
	});
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