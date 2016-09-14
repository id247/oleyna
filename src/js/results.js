'use strict';

import API from './api/api';
import OAuth from './api/hello';
import catchError from './common/catchError';
import { PromoOptions } from 'appSettings';

export default (function App(window, document, $){


	let label = 'all';
	let $DOM = {};
	let profile = false;
	let pageNumber = 1;


	function getDOM(){

		$DOM.container = $('#user-resipes');
		
		$DOM.list = $DOM.container.find('#user-resipes-list');
		$DOM.pagination = $DOM.container.find('#user-resipes-pagination');

		$DOM.profile 			= $DOM.container.find('.js-upload-profile');
		$DOM.name 				= $DOM.container.find('.js-upload-name');
		$DOM.logout 			= $DOM.container.find('.js-upload-logout');
		$DOM.loginPlaceholder 	= $DOM.container.find('.js-upload-login-placeholder');
		$DOM.login 				= $DOM.container.find('.js-upload-login');
		$DOM.result 			= $DOM.container.find('.js-upload-result');
		$DOM.loader 			= $DOM.container.find('.js-upload-loader');
	
	}



	function asyncStart(){
		console.log('go');
		$DOM.loader.show();
	}

	function asyncEnd(){
		console.log('end');
		$DOM.loader.hide();
	}

	function showUserProfile(){
		$DOM.name.html( profile.firstName + ' ' + profile.lastName);
		$DOM.profile.show();
		$DOM.loginPlaceholder.hide();
	}

	function hideUserProfile(){
		$DOM.name.html('');
		$DOM.profile.hide();
		$DOM.loginPlaceholder.show();
	}


	function logout(){
		OAuth.logout();
		profile = false;
		hideUserProfile();
		$DOM.result.html('');
	}

	function render(keys){
		renderList(keys.Keys);
		renderPagination(keys.Paging);
	}

	function renderList(keys){

		if (!keys || keys.length === 0){
			$DOM.list.html(`
				<div class="user-resipes__item user-resipes__item--empty">
					Пока нет ни одной работы.
				</div>
			`);

			return;
		}

		const html = keys.reduce( (oldHtml, key) => {

			let value;

			try{
				value = JSON.parse(decodeURIComponent( key.Value ));
			}catch(e){
				console.error(e);
				return oldHtml + '';
			}

			if (value.files.length === 0){
				return oldHtml + '';
			}

			console.log(value);

			let domain = '';
			switch (true){
				case (location.host.indexOf('localhost') > -1):
					domain = 'https://staging.dnevnik.ru';
					break;
				case (location.host.indexOf('mosreg') > -1):
					domain = 'https://school.mosreg.ru';
					break;
				default:
					domain = 'https://dnevnik.ru';
					break;
			}

			const profileLink = domain + '/user/user.aspx?user=' + value.user.id_str;

			let deleteButton = '';

			if (profile.roles.indexOf('System') > -1){
				deleteButton = (`
					<div class="user-resipes-item__admin">
						<a href="#${key.Key}" class="link js-delete">Удалить</a>
					</div>
				`);
			}

			const files = value.files.reduce( (oldHtml, file) => {
				return oldHtml + (`
					<div class="user-resipes-item__file">
						<img src="${file.downloadUrl}" alt="" class="user-resipes-item__image" />
					</div>
				`);
			}, '');

			return oldHtml + (`
				<div class="user-resipes__item user-resipes-item">
					<div class="user-resipes-item__profile">
						<div class="user-resipes-item__avatar-placeholder">
							<img src="${value.user.photoMedium}" alt="" class="user-resipes-item__avatar" />
						</div>
						<div class="user-resipes-item__name">
							<a href="${profileLink}" class="user-resipes-item__profile-link link" target="_blank">
								${value.user.fullName}
							</a>
						</div>
					</div>
					<div class="user-resipes-item__files">
						${files}
					</div>
					${deleteButton}
				</div>				
			`);
		}, '');


		$DOM.list.html(html);


	}

	function renderPagination(paging){

		const pagesCount = Math.ceil(paging.count / 2);
		if (pagesCount === 1){
			return;
		}

		let html = '';

		for (let i = 1; i < pagesCount ; i++){
			html += (`
				<div class="pagination__item">
					<a href="#${i}" class="js-pagination-href pagination__href ${(i === pageNumber ? 'pagination__href--active' : 'link')}">${i}</a>
				</div>
			`);
		}

		$DOM.pagination.html(html);	
	}



	function getUser(){
		asyncStart();

		return API.getUser()
		.then( user => {
			console.log(user);
			profile = user;
			asyncEnd();

			showUserProfile();
			getFiles();
			
		})
		.catch( err => {
			asyncEnd();
			$DOM.result.html(catchError(err, logout));
			console.error(err);
		});	
	}


	function getFiles(){
		if (!profile){
			return;
		}

		asyncStart();
		API.getKeysFromDBdesc(label, pageNumber)
		.then( keys => {
			asyncEnd();

			console.log(keys);
			render(keys);

		})
		.catch( err => {
			asyncEnd();
			$DOM.result.html(catchError(err, logout));
			console.error(err);
		});	
	}

	function deleteKey(itemKey){
		API.deleteKeyFromDB(itemKey)
		.then( res => {
			asyncEnd();
			getFiles();
		})
		.catch( err => {
			asyncEnd();
			$DOM.result.html(catchError(err, logout));
			console.error(err);
		});	
	}

	function actions(){

		$DOM.login.on('click', function(e){
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

		$DOM.logout.on('click', function(e){
			e.preventDefault();
			logout();
		});

		$(document).on('click', '.js-pagination-href', function(e){
			e.preventDefault();
			pageNumber = parseInt ($(this).attr('href').substr(1) );
			getFiles();
		});


		$(document).on('click', '.js-delete', function(e){
			e.preventDefault();
			const itemKey = $(this).attr('href').substr(1);
			deleteKey(itemKey);
		});

	}

	function init(opts){
		label = opts.label;

		console.log('results go');
		getDOM();
		getUser();
		actions();
	}

	return {
		init
	}

})(window, document, jQuery, undefined);
