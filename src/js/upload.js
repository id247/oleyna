'use strict';

import API from './api/api';
import OAuth from './api/hello';
//import Cookies from 'js-cookie';
import { PromoOptions } from 'appSettings';

export default (function App(window, document, $){

	const $upload = $('#upload');
	const $uploadItem = $upload.find('.js-upload-item');
	
	const $uploadSendButton = $upload.find('.js-upload-send-button');


	const $profile = $upload.find('.js-upload-profile');
	const $name = $upload.find('.js-upload-name');
	const $logout = $upload.find('.js-upload-logout');
	const $result = $upload.find('.js-upload-result');
	const $loader = $upload.find('.js-upload-loader');
	

	let profile = false;
	let files = [];


	function asyncStart(){
		console.log('go');
		$loader.show();
	}

	function asyncEnd(){
		console.log('end');
		$loader.hide();
	}

	function buttonHide(message){
		console.log(message);
		$button.hide();
		$result.html(message);
	}

	function buttonShow(){
		$button.show();
		$result.html('');
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
		$name.html( profile.firstName + ' ' + profile.lastName);
		$profile.show();
	}

	function hideUserProfile(){
		$name.html('');
		$profile.hide();
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
			console.error(err);
		});	
	}

	function uploadImages(){
		files.map( file => {
			if (!file){
				return;
			}
			
			uploadImage(file);
		});
	}
	
	function uploadImage(file){
		asyncStart();

		let fileName = 'fileName';
		let base64 = file;

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

		return API.uploadImageToDB(base64, fileName)
		.then( taskId => {

			console.log(taskId);	

			const interval = setInterval( ()=> {
				
				API.checkUpload(taskId)
				.then( res => {
					console.log(res);

					clearInterval(interval);

					const data = {
						label: 'files-test-1',
						key: res.id_str,
						value: encodeURIComponent(res),
						permissionLevel: 'Public',
					}

					API.addKeyToDB(data)
					.then( res => {

						console.log(res);

					})
					.catch( err => {

						console.error(err);

						//clearInterval(interval);
						//asyncEnd();
					
					});

					asyncEnd();
				})
				.catch( err => {

					console.error(err);

					//clearInterval(interval);
					//asyncEnd();
				
				});

			}, 1000);		
		})
		.catch( err => {
			asyncEnd();
			console.error(err);
		});	
	}

	function addFile(fileId, base64){
		files[fileId] = base64;

		console.log(files);
	}


	function removeFile(fileId){
		delete files[fileId];

		console.log(files);
	}

	function actions(){

		$uploadSendButton.on('click', function(e){
			e.preventDefault();
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

		// $logout.on('click', function(e){
		// 	e.preventDefault();
		// 	OAuth.logout();
		// 	profile = false;
		// 	buttonShow();
		// 	hideUserProfile();
		// });
		// 
		// 
		

		$uploadItem.each(function(){

			const $uploadItem = $(this);

			const $uploadItemButton = $uploadItem.find('.js-upload-button');
			const $uploadItemInput = $uploadItem.find('.js-upload-input');
			const $uploadItemDelete = $uploadItem.find('.js-upload-delete');
			const $imagePlaceholder = $uploadItem.find('.js-upload-image-placeholder');

			const fileId = parseInt( $uploadItem.data('id') );

			$uploadItemButton.on('click', function(e){
				$uploadItemInput.click();
			});	

			$uploadItemInput.on('change', function(e){

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
		        	$uploadItem.addClass('upload-item--filled');
		        }

		        reader.readAsDataURL(file);
			});

			$uploadItemDelete.on('click', function(e){
				e.preventDefault();
				$uploadItemInput.val('');
				$imagePlaceholder.html('');
				$uploadItem.removeClass('upload-item--filled');
				removeFile(fileId);
			});

		});




	}

	function init(){

		getUser();
		actions();
	}

	return {
		init
	}

})(window, document, jQuery, undefined);
