# Google API + Firebase - Boilerplate

## Setup Configuration
copy the `example-config.js` and save it as `config.js` in the same location.

### Firebase Config
From overview , click add Firebase to your web app and copy those value under `firebase: {...}`

### Google API Config
from https://console.developers.google.com you need to enable a few APIs. Click Enable API, from the list add Google Calendar API and Google+ API. You can add anything you want, just make sure to add it to the `discovery_docs` array if you would like to access with in your app. 

Under Credentials, click Create credentials -> API Key. add this to `google` in the config.js file. If there is not already a OAuth 2.0 client IDs create one from the Create credentials drop down. Click the pencil and copy over the Client ID to the config.js file. 

You can add a `hosted_domain` making it so that only people from a given domain that use google can app your app. ie: biz.com.

You need to add the scope for any of the APIs that you added, in this example we are using google+ and the calendar. You can see more scopes here: https://developers.google.com/identity/protocols/googlescopes

We need to add the `discovery_docs` that we need people and calendar. To add more view here: https://developers.google.com/discovery/v1/getting_started

```javascrip
module.exports = {
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
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## Deploy & Authorization 
This app is ready to deploy to heroku just add from github (with a config.js file) or from the heroku toolbelt. We ignore the `config.js` so we need to force add this if we want to keep it out of our Github repo. There are many ways to do this, but here is one solution.

Create an app in the Heroku dashboard. 

Login to heroku with the heroku toolbelt.
`heroku login`

Add the remote 
`heroku git:remote -a {your-app-name}`

Authorize domain. In the Google console under the OAuth 2.0 Client IDs you need to add the heroku domain to Authorized JavaScript origins and Authorized redirect URIs, then click save. This may take a few minutes to take affect.

```
# create a deploy branch that we do not track on heroku
git branch deploy
git checkout deploy

# add everything and force add the config.js file
git add .
git add src/config.js -f 

# commit and push deploy to heroku 
git commit -am "Deploy to heroku!"
git push heroku deploy:master
```
