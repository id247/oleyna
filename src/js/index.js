'use strict';

import upload from './upload';
import results from './results';

console.log('run');

$(function(){
	const uri = document.location.href;
	
	let label = 'files-test-1';

	switch(true){
		case (uri.indexOf('advanced') > -1):
			label = 'test-advanced';
			break;
		case (uri.indexOf('teachers') > -1):
			label = 'test-teachers';
			break;
	}
		
	switch(true){
		case (uri.indexOf('oleyna-competition-results') > -1):
			results.init({
				label: label,
			});
			break;
		case (uri.indexOf('oleyna-competition') > -1):
			upload.init({
				label: label,
			});
			break;
	}
	
});



