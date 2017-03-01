"use strict"

const url = require('url');
const mongoInterface = require('./mongo-interface.js');

function createLogPoint(request, response) {
	let urlObject = url.parse(request.url, true);
	let newLogPoint = urlObject.query;
	if(!typeof urlObject.query.id == "string") {
		failRequest(response, "Invalid id");
		return;
	}

	if(!newLogPoint.description) {
		newLogPoint.description = '';
	} else if(!(typeof newLogPoint.description == 'string')) {
		failRequest(response, "Invalid description");
		return;
	}

	let insertableLogPoint = {
		loggerId : newLogPoint.id,
		time : Date.now(),
		description : newLogPoint.description
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

function getLogPoint(request, response) {
	let urlObject = url.parse(request.url, true);

	if(!!urlObject.query.id && !typeof urlObject.query.id == "string") {
		failRequest(response, "Invalid id");
		return;
	}

	mongoInterface.getLogPoint(urlObject.query.id)
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

function updateLogPoint(request, response) {
	let urlObject = url.parse(request.url, true);
	let updatedLogPoint = urlObject.query;
	if(!typeof updatedLogPoint.id == "string") {
		failRequest(response, "Invalid id");
		return;
	}

	if(!(typeof updatedLogPoint.description == 'string')) {
		failRequest(response, "Invalid description");
		return;
	}

	let insertableLogPoint = {
		loggerId : updatedLogPoint.id,
		description : updatedLogPoint.description
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

function deleteLogPoint(request, response) {
	let urlObject = url.parse(request.url, true);
	if(!typeof urlObject.query.id == "string") {
		failRequest(response, "Invalid id");
		return;
	}

	mongoInterface.deleteLogPoint(urlObject.query.id)
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