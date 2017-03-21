const collection = require('./collection.js');
const fs = require('fs');
const DATA_PATH = "./data";

let collections = {};

if (!fs.existsSync(DATA_PATH)){
    fs.mkdirSync(DATA_PATH);
}

function getCollection(name) {
	if(!collections[name]) {
		collections[name] = collection(name, DATA_PATH);
	}

	return collections[name];
}

exports.getCollection = getCollection;