import { OAuthOptions, APIoptions, PromoOptions } from 'appSettings';

const isMobile = (function() { 
	if( navigator.userAgent.match(/Android/i)
	|| navigator.userAgent.match(/webOS/i)
	|| navigator.userAgent.match(/iPhone/i)
	|| navigator.userAgent.match(/iPad/i)
	|| navigator.userAgent.match(/iPod/i)
	|| navigator.userAgent.match(/BlackBerry/i)
	|| navigator.userAgent.match(/Windows Phone/i)
	){
		return true;
	} else {
		return false;
	}
})();

hello.init({
	[OAuthOptions.provider]: {
		name: OAuthOptions.provider,

		oauth: {
			version: 2,
			auth: OAuthOptions.authUrl,
			grant: OAuthOptions.grantUrl,
		},

		// Refresh the access_token once expired
		refresh: true,

		scope: {
			'basic': OAuthOptions.scope,
		},

		scope_delim: ' ',

		base: APIoptions.base,
	}
});

const options = {
	display: isMobile ? 'page' : 'popup',
	redirect_uri: isMobile ? window.location.href.replace(/\#.*/g, '') : OAuthOptions.redirectUrl,
};

hello.init({
	[OAuthOptions.provider] : OAuthOptions.clientId,
},options);

const dnevnik = hello(OAuthOptions.provider);

function getToken(){
	const response = dnevnik && dnevnik.getAuthResponse();

	if (!response){
		return false;
	}

	if (OAuthOptions.clientId !== response.client_id){
		return false;
	}

	return response.access_token;
}

export default {
	login: () => dnevnik.login(),
	logout: () => dnevnik.logout(),
	getToken: getToken,
};
