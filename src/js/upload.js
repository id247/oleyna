'use strict';

import API from './api/api';
import OAuth from './api/hello';
import catchError from './common/catchError';
import { PromoOptions } from 'appSettings';

export default (function App(window, document, $){

	let $DOM = {};
	let label = 'all';
	let profile = false;
	let files = [];

	function getDOM(){


		$DOM.container = $('#upload');
		$DOM.item = $DOM.container.find('.js-upload-item');
		
		$DOM.sendButton = $DOM.container.find('.js-upload-send-button');

		$DOM.profile 	= $DOM.container.find('.js-upload-profile');
		$DOM.name 		= $DOM.container.find('.js-upload-name');
		$DOM.logout 	= $DOM.container.find('.js-upload-logout');
		$DOM.result 	= $DOM.container.find('.js-upload-result');
		$DOM.loader 	= $DOM.container.find('.js-upload-loader');
	

	}


	function asyncStart(){
		console.log('go');
		$DOM.loader.show();
	}

	function asyncEnd(){
		console.log('end');
		$DOM.loader.hide();
	}

	function buttonHide(message){
		console.log(message);
		$DOM.result.html(message);
	}

	function buttonShow(){
		$DOM.result.html('');
	}


	function checkRoles(){
		if (
			profile.roles.indexOf('EduStudent') === -1
			&& 	
			profile.roles.indexOf('EduStaff') === -1
		){

			buttonHide('Скачивание доступно только для учеников и учителей');
			return false;
		}
		return true;
	}

	function flatArrays(arrays){
		return [].concat.apply([], arrays);
	}

	function filterUniqArrayValues(array){
		return Array.from(new Set( array ));
	}

	function getUniqValuesFromArrays(arrays){
		return filterUniqArrayValues( flatArrays(arrays) ); // only unic
	}



	function showUserProfile(){
		$DOM.name.html( profile.firstName + ' ' + profile.lastName);
		$DOM.profile.show();
	}

	function hideUserProfile(){
		$DOM.name.html('');
		$DOM.profile.hide();
	}

	function getUser(){
		asyncStart();

		return API.getUser()
		.then( user => {
			console.log(user);
			profile = user;
			asyncEnd();

			showUserProfile();
			
		})
		.catch( err => {
			asyncEnd();
			$DOM.result.html(catchError(err, logout));
			console.error(err);
		});	
	}

	
	function uploadImages(){
		asyncStart();

		const filePromises = files
		.filter( file => file.fileName )
		.map( file => {
			return API.uploadImageToDB(file.base64, file.fileName);
		});
	

		return Promise.all(filePromises)
		.then( tasksIds => {

			console.log(tasksIds);	

			const tasksPromises = tasksIds.map( taskId => {
				return new Promise( (resolve, reject) =>{
					
					const interval = setInterval( ()=> {
						
						API.checkUpload(taskId)
						.then( res => {
							console.log(res);

							clearInterval(interval);

							resolve(res);

						})
						.catch( err => {
							console.log(err);
						});

					}, 2000);	


				});
			});

			return Promise.all(tasksPromises);	
		})
		.then( (filesData) => {

			console.log(filesData);

			const value = {
				user: profile,
				files: filesData,
			}

			const data = {
				label: label,
				key: 'competition-' + new Date().getTime(),
				value: encodeURIComponent(JSON.stringify(value)),
				permissionLevel: 'Public',
			}

			return API.addKeyToDB(data);
		})
		.then( res => {
			asyncEnd();
			console.log(res);
			$DOM.result.html('Файлы успешно отправлены!');
		})
		.catch( err => {
			asyncEnd();
			$DOM.result.html(catchError(err, logout));
			console.error(err);
		});	
	}

	function addFile(fileId, base64){

		let fileName = 'fileName';

		switch(true){
			case (base64.indexOf('image/png') > -1):
				base64 = base64.replace(/data:image\/png;base64,/, '');
				fileName += '.png';
				break;
			case (base64.indexOf('image/jpg') > -1):
				base64 = base64.replace(/data:image\/jpg;base64,/, '');
				fileName += '.jpg';
				break;
			case (base64.indexOf('image/jpeg') > -1):
				base64 = base64.replace(/data:image\/jpeg;base64,/, '');
				fileName += '.jpeg';
				break;
			case (base64.indexOf('image/gif') > -1):
				base64 = base64.replace(/data:image\/gif;base64,/, '');
				fileName += '.gif';
				break;
		}	

		files[fileId] = {
			fileName: fileName,
			base64: base64,
		};

		console.log(files);
	}


	function removeFile(fileId){
		delete files[fileId];

		console.log(files);
	}

	function logout(){
		OAuth.logout();
		profile = false;
		hideUserProfile();
	}

	function actions(){

		$DOM.sendButton.on('click', function(e){
			e.preventDefault();

			const notEmptyFiles = files.filter( file => file.fileName );

			if (notEmptyFiles.length === 0){
				return;
			}

			asyncStart();
			if (!profile){

				OAuth.login()
				.then( 
					() => {
						asyncEnd();
						return getUser();
					},
					err => {
						asyncEnd();
						console.log(err);
					}
				)
				.then( () => {
					asyncEnd();
					uploadImages();
				});

				return;
			}

			uploadImages();
			
		});

		$DOM.logout.on('click', function(e){
			e.preventDefault();
			logout();
		});
		
		
		$DOM.item.each(function(){

			const $item = $(this);

			const $uploadButton = $item.find('.js-upload-button');
			const $uploadInput = $item.find('.js-upload-input');
			const $uploadDelete = $item.find('.js-upload-delete');
			const $imagePlaceholder = $item.find('.js-upload-image-placeholder');

			const fileId = parseInt( $item.data('id') );

			$uploadButton.on('click', function(e){
				$uploadInput.click();
			});	

			$uploadInput.on('change', function(e){

				const input = this;
				const file = input.files && input.files[0] ? input.files[0] : false;

			    if (!file || !(/\.(jpe?g|png|gif)$/i.test(file.name))) {
			    	input.value = '';
			    	return false;
			    }

		        const reader = new FileReader();
		        const image = new Image();

		        reader.onload = function(e){
		        	const base64 = e.target.result;
		        	image.src = base64;

		        	addFile(fileId, base64);
		        }

		        image.onload = function(){
		        	$imagePlaceholder.html(image);
		        	$item.addClass('upload-item--filled');
		        }

		        reader.readAsDataURL(file);
			});

			$uploadDelete.on('click', function(e){
				e.preventDefault();
				$uploadInput.val('');
				$imagePlaceholder.html('');
				$item.removeClass('upload-item--filled');
				removeFile(fileId);
			});

		});

	}

	function init(opts){
		label = opts.label;
		console.log('upload go');
		getDOM();
		getUser();
		actions();
	}

	return {
		init
	}

})(window, document, jQuery, undefined);
