const uuidV4 = require('uuid/v4');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

function collection(name, dataPath) {
	let logPath = path.resolve(dataPath, name + '_log');
	let sourcePath = path.resolve(dataPath, name);
	let collection = [];
	let persistenceStream = fs.createWriteStream(logPath, {flags:'a'});

	unPack();

	function persistChange(operation) {
		persistenceStream.write(JSON.stringify(operation)+'\n');
	}

	function pack() {
		persistenceStream.cork();
		fs.writeFile(sourcePath, JSON.stringify(collection), 'utf-8',() => {
			fs.writeFile(logPath, '','utf-8', () => {
				persistenceStream.uncork();
			});
		});
	}

	function unPack() {
		try {
			let collectionFileContent = fs.readFileSync(sourcePath, 'utf-8');

			if(!collectionFileContent || collectionFileContent.length == 0) {
				collection = [];
			} else {
				collection = JSON.parse(collectionFileContent);
			}
		} catch (err) {
			collection = [];
		}

		fs.readFileSync(logPath, 'utf-8')
		.split('\n')
		.forEach((line) => {
			if(!line || line.length == 0) {
				return;
			}

			let operation = JSON.parse(line);
			switch(operation.operation) {
				case 'I':
				collection.push(operation.data);
				break;
				case 'U':
				findElements((element) => element['_id'] == operation.data['_id'])
				.forEach((element) => extend(element, operation.data));
				break;
				case 'D':
				collection.splice(operation.index, 1);
				break;
			}
		});
		pack();
		setInterval(pack, 1000 * 60 * 60);
	}

	function findElements(query) {
		return collection.filter((element, index) => {
			if(query(element)) {
				element['_index'] = index;
				return true;
			}
			return false;
		});
	}

	function insertElement(data) {
		data['_id'] = uuidV4();
		collection.push(data);
		persistChange({operation:'I', data: data});
		return data['_id'];
	}

	function updateElements(query, update) {
		findElements(query)
		.forEach((element) => {
			update(element);
			persistChange({operation:'U', data:element});
		});

	}

	function deleteElements(query) {
		findElements(query)
		.reverse()
		.forEach((element) => {
			persistChange({operation:'D', index:element['_index']});
			collection.splice(element['_index'], 1);
		});
	}

	return {
		findElements : findElements,
		insertElement : insertElement,
		updateElements : updateElements,
		deleteElements : deleteElements
	};
}

module.exports = collection;