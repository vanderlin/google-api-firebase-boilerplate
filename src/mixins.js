var _ = require('lodash')
var moment = require('moment')
var firebase = require('firebase')
module.exports = {
	computed: {
		currentUser() {
			return firebase.auth().currentUser
		},
		currentUserProfile() {
			return this.$store.state.currentUserProfile
		},
		authenticated() {
			return this.$store.state.authenticated
		}
	},
	methods: {
		firebaseTimestamp() {
			return firebase.database.ServerValue.TIMESTAMP
		},
		signin() {
            this.$router.push({name: 'login'})
        },
        signout() {
            this.$router.push({name: 'logout'})
        }
	}
}
