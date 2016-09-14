export default function catchError(err, logout){
			
	let errorStart = 'Ошибка ' + err.message + ':';
	let errorEnd = 'Попробуйте обновить страницу.';

	if (!err.description) {
		console.error(errorStart + ' ' + err);			
		return(errorStart + err + errorEnd);
	}

	const description = err.description.type + ' (' + err.description.description + ')'; 

	console.error(errorStart + ' ' + description);

	switch (err.message){
		case 401:					
			logout();
			return '';
			
			break;
		case 403: 
			errorEnd = 'Отказано в доступе.'
			
			break;
		case 404: 
			errorEnd = 'Запрошеный ресурс не найден.'
			
			break;
	}
	
	return(errorStart + ' ' + description + ' ' + errorEnd);
	
}
