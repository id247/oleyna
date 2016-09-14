export default (function App(window, document, $){

	let $DOM = {};
	
	function getDOM(){
		$DOM.profile 			= $('.js-profile');
		$DOM.user 				= $DOM.profile.find('.js-profile-user');
		$DOM.name 				= $DOM.profile.find('.js-profile-name');
		$DOM.logout 			= $DOM.profile.find('.js-profile-logout');
		$DOM.loginPlaceholder 	= $DOM.profile.find('.js-profile-login-placeholder');
		$DOM.login 				= $DOM.profile.find('.js-profile-login');
	}

	function showUserProfile(profile){
		if (!profile){
			return;
		}
		$DOM.name.html( profile.firstName + ' ' + profile.lastName);
		$DOM.user.show();
		$DOM.loginPlaceholder.hide();
	}

	function hideUserProfile(){
		$DOM.name.html('');
		$DOM.user.hide();
		$DOM.loginPlaceholder.show();
	}

	function init(){
		getDOM();
	}

	return {
		init,
		showUserProfile,
		hideUserProfile,
	}

})(window, document, jQuery, undefined);
