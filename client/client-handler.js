"use strict"

const url = require('url');
const path = require('path');
const fs = require('fs');

const START_PAGE = path.resolve(path.join('client', 'static', 'graph','graph.html'));
const NOT_FOUND_PATH = path.resolve(path.join('client', 'static', '404.html'));

function handleRequest(request, response, parameters) {
	let pathname = url.parse(request.url).pathname;
	let requestedPath;
	if(pathname == '' || pathname == '/') {
		requestedPath = START_PAGE;
	} else {
		requestedPath = path.resolve(path.join('client','static', pathname));
	}

	fs.readFile(requestedPath, (err, data) => {
		if (err) {
			console.log(err);
			fs.readFile(NOT_FOUND_PATH, (err, data) => {
				if (err) {
					response.writeHead(776, { 'Content-Type': 'text/plain' });
					response.end("Error on the exception");
				} else {
					response.writeHead(200, { 'Content-Type': 'text/html' });
					response.end(data);
				}
			});
		} else {
			let contentType;
			if(requestedPath.endsWith('.html')) {
				contentType = 'text/html';
			} else if(requestedPath.endsWith('.css')) {
				contentType = 'text/css';
			} else if(requestedPath.endsWith('.js')) {
				contentType = 'application/javascript';
			} else {
				contentType = "text/plain";
			}
			response.writeHead(200, { 'Content-Type': contentType });
			response.end(data);
		}
	});
}

exports.handleRequest = handleRequest;