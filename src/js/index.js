'use strict';

import upload from './upload';
import results from './results';
import profileDom from './profileDom';

console.log('run');

$(function(){
	const uri = document.location.href;
	
	let label = 'oleyna-files-new';

	profileDom.init();

	switch(true){
		case (uri.indexOf('advanced') > -1):
			label = 'oleyna-files-advanced';
			break;
		case (uri.indexOf('teachers') > -1):
			label = 'oleyna-files-teachers';
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



