const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017/upgraded-waffle';

function connect() {
	return MongoClient.connect(url);
}

function createLog(logEntry) {
	let database = null;
	return connect()
	.then(function(db) {
		database = db; 
		return db.collection('logs').insertOne(logEntry);
	})
	.then(function(insertResult) {
		database.close();
		return insertResult;
	});
}

function getLogs(logSource) {
	let database = null;
	return connect()
	.then(function(db) {
		database = db; 
		return db.collection('logs').find(logSource).toArray();
	})
	.then(function(result){ 
		database.close();
		return result;
	});
}


exports.createLog = createLog;
exports.getLogs = getLogs;
