const db = require('./db/simpledb.js');
const extend = require('extend');
const LOG_COLLECTION = 'LOG_COLLECTION';
const LOG_POINT_COLLECTION = 'LOG_POINT_COLLECTION';

function createLog(logEntry) {
	db.getCollection(LOG_COLLECTION).insertElement(logEntry);
}

function getLogs(loggerId) {
	return db.getCollection(LOG_COLLECTION).findElements((element) => element['loggerId'] == loggerId);
}

function createLogPoint(logPoint) {
	db.getCollection(LOG_POINT_COLLECTION).insertElement(logPoint);
}

function getLogPoint(loggerId) {
	let query = (element) => true;
	if(!!loggerId) {
		query = (element) => element.loggerId == loggerId;
	}
	return db.getCollection(LOG_POINT_COLLECTION).findElements(query);
}

function updateLogPoint(logPoint) {
	db.getCollection(LOG_POINT_COLLECTION).updateElements(
		(element) => element['loggerId'] == logPoint.loggerId,
		(element) => extend(element, {description:logPoint.description, color:logPoint.color}));
}

function deleteLogPoint(loggerId) {
	db.getCollection(LOG_POINT_COLLECTION).deleteElements((element) => element['loggerId'] == loggerId);
}

exports.createLog = createLog;
exports.getLogs = getLogs;
exports.createLogPoint = createLogPoint;
exports.getLogPoint = getLogPoint;
exports.updateLogPoint = updateLogPoint;
exports.deleteLogPoint = deleteLogPoint;
