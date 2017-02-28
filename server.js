"use strict";

const http = require('http');
const requestHandler = require('./request-handler.js');
const logEntryHandler = require('./log-entry-handler.js');

requestHandler.addHandler("/log/data", logEntryHandler.getRequestHandler());

http.createServer(requestHandler.handleRequest).listen(1337);

console.log("Server running at http://127.0.0.1:1337/");
