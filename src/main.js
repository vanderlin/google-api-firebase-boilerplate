import VueRouter from 'vue-router'
import Vuefire from 'vuefire'
import Vue from 'vue'
import App from './App'
import firebase from 'firebase'
import store from './store'
import mixins from './mixins'
import DB from './db'
import filters from './filters'
import directives from './directives'
import config from './config'

Vue.use(Vuefire)
Vue.use(VueRouter)

// filters
Object.keys(filters).forEach((name) => {
	Vue.filter(name, filters[name]);
})

// directive
Object.keys(directives).forEach((name) => {
	Vue.directive(name, directives[name]);
})

// mixins
Vue.mixin(mixins)

// these are all our pages
import Index from './pages/Index'

// authentication guard
const authRequired = (to, from, next) => {
	if (!store.state.authenticated) {
		next({path: '/login'})
	} else {
		next()
	}
}

// vue routes
const routes = [
	{
		name: 'home', 
		path: '/', 
		component: Index
	},
	{
		name: 'login',
		path: '/login', 
		component: Index,
		beforeEnter: (to, from, next) => {
			if (store.state.authenticated) {
				next()
			} else {
				var auth = gapi.auth2.getAuthInstance()
				auth.signIn().then((e) => {
					console.log('SignIn');
					updateAuthStatus().then(() => {
						next({name: 'home'})
					})
				})
			}
		}
	},
	{
		name: 'logout',
		path: '/logout',
		component: Index,
		beforeEnter: (to, from, next) => {
			var auth = gapi.auth2.getAuthInstance()
			auth.signOut().then(() => {
				document.location = '/'
			})
		}
	},
	{
		path: '*',
		component: Index,
		beforeEnter: (to, from, next) => {
			next({path: '/'})
		}
	}
]

// this is the conductor for which page we are on
const router = new VueRouter({routes: routes})

// init the google api
function initGoogleAPI() {
	return new Promise((resolve) => {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = 'https://apis.google.com/js/api.js';
		script.onload = (e) => {
			gapi.load('client:auth2', () => {
				gapi.client.init({
					apiKey: config.google.api_key,
	            	clientId: config.google.client_id,
	            	discoveryDocs: config.google.discovery_docs,
	            	scope: config.google.scope,
	        	}).then(() => {
					store.commit('currentUserProfile', null)
					store.commit('authenticated', false)
					resolve()					
				})
        	});
		}
		document.getElementsByTagName('head')[0].appendChild(script);
	})
}

function updateAuthStatus() {
	return new Promise((resolve) => {
		
		// we have no auth!
		if (!gapi.auth2.getAuthInstance()) {
			store.commit('authenticated', false)
			resolve(false)
			return;
		}
		
		var googleUser = gapi.auth2.getAuthInstance().currentUser.get()
		var googleProfile = googleUser.getBasicProfile()
		var isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get()

		if (isSignedIn) {

			var credential = firebase.auth.GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
			// we now want to auth in to Firebase with the googleUser credentials
			// this function is a bit magic, it will create the user as well - if it does not exist
			firebase.auth().signInWithCredential(credential).then((user) => {
				
				// do we have a user?
				var hasUser = Boolean(user !== null)

				if (hasUser) {
					DB.ref('profiles').child(user.uid).once('value', (snap) => {
						var profile = snap.val()
						console.log(profile);
						if (profile === null) {
							var payload = {
								email: user.email,
								displayName: user.displayName,
								photoURL: user.photoURL, 
								refreshToken: user.refreshToken,
								uid: user.uid
							}
							snap.ref.update(payload).then((e) => {
								store.commit('currentUserProfile', payload)
								store.commit('authenticated', hasUser)
								resolve()
							})
						} else {
							store.commit('currentUserProfile', profile)
							store.commit('authenticated', hasUser)
							resolve()
						}
					})
				} else {
					resolve(hasUser)
				}
			})
		} else {
			store.commit('authenticated', false)
			resolve(false)
		}
	})
}

function init() {
	return new Promise((resolve) => {
		// make sure the google api script is loaded
		initGoogleAPI().then(() => {
	  		updateAuthStatus().then(() => {
	  			resolve()
	  		}) 
		})
	})
}

// kick off the vue appp
init().then((status) => {
	new Vue({
		store,
		router,
		...App
	}).$mount('#app');
})