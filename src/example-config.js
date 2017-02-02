module.exports = {
	app_name: 'google-api-firebase',
	google: {
		client_id: '****.apps.googleusercontent.com',	
		api_key: '****',
		hosted_domain: '****.com',
		scope: 'profile email https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/plus.login',
		discovery_docs: [	      
			'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest', 
			'https://people.googleapis.com/$discovery/rest?version=v1'
		],
	},
	firebase: {
		apiKey: '****',
		authDomain: '****.firebaseapp.com',
		databaseURL: 'https://****.firebaseio.com',
		storageBucket: '****.appspot.com',
		messagingSenderId: '****'
	}
}