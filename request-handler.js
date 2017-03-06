"use strict"

const extend = require('extend');
const qs = require('querystring');
const url = require('url');
const clientHandler = require('./client/client-handler.js');

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
	var body = '';
	request.on('data', function (data) {
		body += data;

            // Too much POST data, kill the connection (4kb)
            if (body.length > 4096)
            	request.connection.destroy();
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

exports.handleRequest = handleRequest;
exports.addHandler = addHandler;