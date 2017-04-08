"use strict"

const extend = require('extend');
const qs = require('querystring');
const url = require('url');
const clientHandler = require('./client/client-handler.js');
const tcpHandler = require('./log-entry-handler.js');

let handlers = {};

function handleRequest(request, response) {
	let urlObject = url.parse(request.url,true);
	let requestedHandler = handlers[urlObject.pathname];
	if (!requestedHandler) {
		clientHandler.handleRequest(request, response);
		return;
	}
	let handlerMethod = requestedHandler[request.method];
	if(!handlerMethod) {
		failRequest(response);
		return;
	}
	let body = '';
	request.on('data', function (data) {
		body += data;

            // Too much POST data, kill the connection (4kb)
            if (body.length > 4096) {
            	request.connection.destroy();
            }
        });

	request.on('end', function () {
		let sentParameters = extend({}, url.parse(request.url,true).query, qs.parse(body));
		handlerMethod(request, response, sentParameters);
	});
}

function addHandler(name, handler) {
	handlers[name] = handler;
}

function failRequest(response) {
	response.writeHead(718, { 'Content-Type': 'text/plain' });
	response.end('I am not a teapot');
}

function handleTCPRequest(socket) {
	let connectionData = '';
	socket.on('data', function (data) {
		connectionData += data;

		// Too much data, kill the connection (1kb)
		if (connectionData.length > 1024) {
			socket.destroy();
		}
	});

	socket.on('end', function () {
		tcpHandler.addLog(JSON.parse(connectionData));
	});
}

exports.handleRequest = handleRequest;
exports.addHandler = addHandler;
exports.handleTCPRequest = handleTCPRequest;