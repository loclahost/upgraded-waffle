const url = require('url');

let handlers = {};

function handleRequest(request, response) {
	let urlObject = url.parse(request.url);
	console.log("Requested handler: " + urlObject.pathname + ". Requested method: " + request.method);
	let requestedHandler = handlers[urlObject.pathname];
	if (!requestedHandler) {
		failRequest(response);
		return;
	}
	let handlerMethod = requestedHandler[request.method];
	if(!handlerMethod) {
		failRequest(response);
		return;
	}
	handlerMethod(request, response);
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