"use strict"

const url = require('url');
const path = require('path');
const fs = require('fs');

const NOT_FOUND_PATH = path.resolve(path.join('client', 'static', '404.html'));

function handleRequest(request, response) {
	let requestedPath = path.resolve(path.join('client','static', url.parse(request.url).pathname));
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
			response.writeHead(200, { 'Content-Type': 'text/html' });
			response.end(data);
		}
	});
}

exports.handleRequest = handleRequest;