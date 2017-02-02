var env = process.env.NODE_ENV;
import firebase from 'firebase'
import config from './config'
firebase.initializeApp(config.firebase)
export default {
	ref(path) {
		return firebase.database().ref(`${env}/${path}`)
	}
}
