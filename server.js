"use strict";

const net = require('net');
const http = require('http');
const requestHandler = require('./request-handler.js');
const logEntryHandler = require('./log-entry-handler.js');
const logPointHandler = require('./log-point-handler.js');

requestHandler.addHandler("/log/data", logEntryHandler.getRequestHandler());
requestHandler.addHandler("/log/point", logPointHandler.getRequestHandler());

http.createServer(requestHandler.handleRequest).listen(1337);
net.createServer(requestHandler.handleTCPRequest).listen(1338);

console.log("Server running at http://127.0.0.1:1337/. TCP connections will be accepted on 1338.");
