// export const OAuthOptions = {
// 	authUrl: 'https://login.feature01.dnevnik.ru/oauth2',
// 	grantUrl: 'https://api.feature01.dnevnik.ru/v1/authorizations',
// 	scope: 'Avatar,FullName,Birthday,Age,Roles,Schools,Organizations,EduGroups,Lessons,Marks,EduWorks,Relatives,Files,Contacts,Friends,Groups,Networks,Events,Wall,Messages,EmailAddress,Sex,SocialEntityMembership',	
// 	clientId: '5123975fe9eb415390fb7aa316a15e4e',
// 	redirectUrl: 'https://ad.dnevnik.ru/promo/oauth2',
// }

// export const APIoptions = {	
// 	base: 'https://api.feature01.dnevnik.ru/v1/',
// }

// export const PromoOptions = {	
// 	url: 'http://feature01.dnevnik.ru/promo/wishlist3',
// 	server: 'https://feature01.dnevnik.ru',
// }

// export const ForumOptions = {	
// 	pageSize: 5,
// 	psyhoId: '1000001035607',
// 	postsLabel: 'posts-test-1',
// }


export const OAuthOptions = {
	authUrl: 'https://login.dnevnik.ru/oauth2',
	grantUrl: 'https://api.dnevnik.ru/v1/authorizations',
	scope: 'Avatar,FullName,Birthday,Age,Roles,Files,Sex',	
	clientId: 'f84accc763e34b5b83469c9ef1a9ea62',
	redirectUrl: 'https://ad.dnevnik.ru/promo/oauth2',
	redirectUrlMobile: 'https://ad.dnevnik.ru/promo/hidden-forum',
}

export const APIoptions = {	
	base: 'https://api.dnevnik.ru/v1/',
}

export const PromoOptions = {	
	url: 'https://ad.dnenvik.ru/promo/hidden-forum',
	server: 'https://dnevnik.ru',
}

export const ForumOptions = {	
	pageSize: 15,
	psyhoId: '1000005449055,1000005031742',
	anonAvatar: 'https://static.dnevnik.ru/images/avatars/user/a.m.jpg',
	postsLabel: {
		mothers: 'posts-test-1',
		girls: 'posts-test-2',
		competition: 'posts-test-3',
	},
}
