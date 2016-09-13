//because hello.api() is piece of shit

import OAuth from './hello.js';

import { APIoptions } from 'appSettings';

function sendRequest(o){

	const accessToken = OAuth.getToken();

	o.headers = {
		'Access-Token': accessToken,
	};

	// if (!accessToken){
	// 	return Promise.reject(requestError(401, 'no token'));	
	// }

	//const url = APIoptions.base + o.path;
	const url = generateUrl(APIoptions.base, o.path, accessToken);
		
	if (o.method){
		o.headers = {
			...o.headers, 
			...{'Content-Type': 'application/json'}
		};

		if (o.body){
			o.body = JSON.stringify(o.body);
		}
	}	

	console.log(o);

	//return;

	return fetch(url, o)
	.then( (response) => selectResponse(response) );
} 

function generateUrl(base, path, token){
	const join = path.indexOf('?') > -1 ? '&' : '?';
	const url = base + path + join + 'access_token=' + token;
	return url;
}

function selectResponse(response){
	console.log(response);
	switch(response.status){
		case 200: 
			return response.text()
			.then(text => {				
				try{
					text = JSON.parse(text);
				}catch(e){

				}	
				return text;
			});
		default:	
			return response.text()
			.then(text => {				
				try{
					text = JSON.parse(text);
				}catch(e){

				}	
				throw requestError(response.status, text);
			});
			
	}	
}

function requestError(name, description){
	const err = new Error();
	err.message = name;
	err.description = description;
	return err;
}

export default sendRequest;
