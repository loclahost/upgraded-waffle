const MongoClient = require('mongodb').MongoClient;

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

function createLogPoint(logPoint) {
	let database = null;
	return connect()
	.then(function(db) {
		database = db; 
		return db.collection('logPoint').insertOne(logPoint);
	})
	.then(function(insertResult) {
		database.close();
		return insertResult;
	});
}

function getLogPoint(loggerId) {
	let database = null;
	return connect()
	.then(function(db) {
		database = db;
		let query = {};
		if(!!loggerId) {
			query.loggerId = loggerId;
		}
		return db.collection('logPoint').find(query).toArray();
	})
	.then(function(result){ 
		database.close();
		return result;
	});
}

function updateLogPoint(logPoint) {
	let database = null;
	return connect()
	.then(function(db) {
		database = db; 
		return db.collection('logPoint').updateOne({loggerId:logPoint.loggerId}, {$set:{description:logPoint.description}});
	})
	.then(function(insertResult) {
		database.close();
		return insertResult;
	});
}

function deleteLogPoint(loggerId) {
	let database = null;
	return connect()
	.then(function(db) {
		database = db; 
		return db.collection('logPoint').deleteOne({loggerId:loggerId});
	})
	.then(function(insertResult) {
		database.close();
		return insertResult;
	});
}

exports.createLog = createLog;
exports.getLogs = getLogs;
exports.createLogPoint = createLogPoint;
exports.getLogPoint = getLogPoint;
exports.updateLogPoint = updateLogPoint;
exports.deleteLogPoint = deleteLogPoint;
