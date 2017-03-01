const MongoClient = require('mongodb').MongoClient;

const URL = 'mongodb://localhost:27017/upgraded-waffle';
const LOG_COLLECTION = 'log';
const LOG_POINT_COLLECTION = 'logPoint';

function connectAndDo(databaseOperation) {
	let database = null;
	return MongoClient.connect(URL)
	.then(function(db) {
		database = db;
		return databaseOperation(db);
	})
	.then(function(someResult) {
		database.close();
		return someResult;
	});
}

function createLog(logEntry) {
	return connectAndDo((db) => db.collection(LOG_COLLECTION).insertOne(logEntry));
}

function getLogs(logSource) {
	return connectAndDo((db) => db.collection(LOG_COLLECTION).find(logSource).toArray());
}

function createLogPoint(logPoint) {
	return connectAndDo((db) => db.collection(LOG_POINT_COLLECTION).insertOne(logPoint));
}

function getLogPoint(loggerId) {
	let database = null;
	return connectAndDo(function(db) {
		let query = {};
		if(!!loggerId) {
			query.loggerId = loggerId;
		}
		return db.collection(LOG_POINT_COLLECTION).find(query).toArray();
	});
}

function updateLogPoint(logPoint) {
	return connectAndDo((db) => db.collection(LOG_POINT_COLLECTION).updateOne({loggerId:logPoint.loggerId}, {$set:{description:logPoint.description}}));
}

function deleteLogPoint(loggerId) {
	return connectAndDo((db) => db.collection(LOG_POINT_COLLECTION).deleteOne({loggerId:loggerId}));
}

exports.createLog = createLog;
exports.getLogs = getLogs;
exports.createLogPoint = createLogPoint;
exports.getLogPoint = getLogPoint;
exports.updateLogPoint = updateLogPoint;
exports.deleteLogPoint = deleteLogPoint;
