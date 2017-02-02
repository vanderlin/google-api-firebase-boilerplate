import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        authenticated: false,
        currentUserProfile: null,
        googleUser: null
    },

    mutations: {
        authenticated (state, payload) {
            state.authenticated = payload;
        },
        googleUser (state, payload) {
            state.googleUser = payload;
        },
        currentUserProfile (state, payload) {
            state.currentUserProfile = payload;
        }
    }
});
