'use strict';

import Ajax from './ajax.js';

function paramsError(description){
	return Promise.reject(new Error(description));
}


function getUser(userId = 'me'){
	if (!userId){
		return paramsError('no userId in API.getUser');
	}
	const options = {
		path: 'users/' + userId,
	};

	return Ajax(options);
}


function getUserSchoolsIds(){
	const options = {
		path: 'users/me/schools',
	};

	return Ajax(options);
}

function getSchool(schoolId){
	if (!schoolId){
		return paramsError('no schoolId in API.getSchool');
	}
	const options = {
		path: 'schools/' + schoolId,
	};

	return Ajax(options);
}


function addKeyToDB(data){
	if (!data){
		return paramsError('no data in API.addKeyToDB');
	}

	const options = {
		path: 'storage/keys',
		method: 'post',
		body: data,
	};

	return Ajax(options);
}

function getKeyFromDB(key){
	if (!key){
		return paramsError('no key in API.getKeyFromDB');
	}

	const options = {
		path: 'storage/keys/' + key,
	};

	return Ajax(options);
}

function deleteKeyFromDB(key){
	if (!key){
		return paramsError('no key in API.deleteKeyFromDB');
	}

	const options = {
		path: 'storage/keys/' + key + '/delete',
		method: 'post',
	};

	return Ajax(options);
}

function getKeysFromDB(label, page_number = 1, page_size = 30, order_by = 'date_asc'){
	if (!label){
		return paramsError('no label in API.getKeysFromDB');
	}

	const options = {
		path: 'storage/keys?label=' + label 
				+ '&page_number=' + page_number 
				+ '&page_size=' + page_size
				+ '&order_by=' + order_by,
	};

	return Ajax(options);
}

function getKeysFromDBdesc(label, page_number = 1, page_size = 2){
	if (!label){
		return paramsError('no label in API.getKeysFromDBdesc');
	}
	return this.getKeysFromDB(label, page_number, page_size, 'date_desc')
}

function getCoutersFromDB(label, page_number = 1, page_size = 30, order_by = 'date_asc'){
	if (!label){
		return paramsError('no label in API.getCouters');
	}

	const options = {
		path: 'storage/counters?label=' + label 
				+ '&page_number=' + page_number 
				+ '&page_size=' + page_size
				+ '&order_by=' + order_by,
	};

	return Ajax(options);

}

function getCoutersFromDBdesc(label, page_number = 1, page_size = 10000){
	if (!label){
		return paramsError('no label in API.getCoutersFromDBdesc');
	}
	return this.getCoutersFromDB(label, page_number, page_size, 'date_desc')
}


function voteForCounterFromDB(keyId, label = ''){
	if (!keyId){
		return paramsError('no keyId in API.voteForCounterFromDB');
	}

	const options = {
		path: 'storage/counters/' + keyId + '/vote',
		method: 'post',
		body: label,		
	};

	return Ajax(options);
}


function uploadImageToDB(base64, fileName){
	if (!base64){
		return paramsError('no base64 in API.uploadImageToDB');
	}
	if (!fileName){
		return paramsError('no fileName in API.uploadImageToDB');
	}
	const options = {
		path: 'apps/current/files/async/upload/base64',
		method: 'post',
		body: {
			file: base64,
			fileName: fileName,
		},
	};

	return Ajax(options);
}


function checkUpload(taskId){
	if (!taskId){
		return paramsError('no taskId in API.checkUpload');
	}
	const options = {
		path: 'files/async/upload/' + taskId,
	};

	return Ajax(options);
}



export default {
	getUser,
	getUserSchoolsIds,
	getSchool,
	uploadImageToDB,
	checkUpload,
	addKeyToDB,
	deleteKeyFromDB,
	getKeyFromDB,
	getKeysFromDB,
	getKeysFromDBdesc,
}



