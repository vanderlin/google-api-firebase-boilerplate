<template>
    <section class="hero is-fullheight">
        <div class="hero-body">
            <div class="container">
            
            <div class="colums has-text-centered" v-if="!authenticated">
                <router-link class="button is-large is-primary" :to="{name: 'login'}">Sign In</router-link>
            </div>
            
            <div class="colums is-multiline" v-if="authenticated && currentUserProfile">
                    
                    <div class="column is-6 is-offset-3">
                        
                        <!-- user info -->
                        <div class="has-text-centered">
                            <figure class="image is-128x128">
                                <img :src="currentUserProfile.photoURL" alt="Avatar">
                            </figure>
                            <h1 class="title">
                                {{currentUserProfile.displayName}}
                            </h1>
                            <h2 class="subtitle">
                                {{currentUserProfile.email}}
                            </h2>
                            <router-link class="link" :to="{name: 'logout'}">Sign Out</router-link>
                        </div>
    
                        <!-- loaded google calendar events -->
                        <div class="google-calendar-events">
                            <template v-if="!isLoadingEvents && !errors.length">
                                <label class="label">Google Calendar Events</label>
                                <ul class="events" v-if="!errors.length">
                                    <li v-for="event in events">
                                        <a :href="event.htmlLink">
                                            <div class="info">
                                                <b>{{event.summary}}</b>
                                                <span class="location">{{event.location}}</span>
                                                <span class="datetime">{{event.start.dateTime | dateFormat('lll')}} - {{event.end.dateTime | dateFormat('lll')}}</span>
                                            </div>
                                            <span class="attendees" v-if="event.attendees">{{event.attendees.length}} Attending</span>
                                        </a>
                                    </li>
                                </ul>
                            </template>
                            <template v-if="isLoadingEvents">
                                <div class="loading-events">
                                    <i class="fa fa-circle-o-notch fa-spin fa-2x fa-fw"></i>
                                    <span class="sr-only">Loading...</span>
                                </div>
                            </template>
                            <template v-if="!isLoadingEvents && errors.length">
                                <div class="errors help is-danger">
                                    <span v-for="error in errors">{{error.message}}</span>
                                </div>
                            </template>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    </section>
</template>

<script>
import DB from '../db'
import moment from 'moment'
export default {
    name: 'IndexPage',
    props: {},
    components: {
    },
    methods: {
        loadEvents() {
            if (this.authenticated) {
                this.isLoadingEvents = true;
                gapi.client.calendar.events.list({
                    'calendarId': 'primary',
                    'timeMin': (new Date()).toISOString(),
                    'showDeleted': false,
                    'singleEvents': true,
                    'orderBy': 'startTime'
                }).then((response) => {
                    this.isLoadingEvents = false;
                    this.events = response.result.items;
                }, (e) => {
                    if (e.result.error) {
                        this.errors = e.result.error.errors
                        this.isLoadingEvents = false
                    }
                })
            }
        }
    },
    data () {
        return {
            isLoadingEvents: true,
            errors: [],
            events: []
        }
    },
    computed: {

    },
    watch: {
        authenticated(val) {
            if (val && this.events.length === 0) {
                this.loadEvents()
            }
        }
    },
    created () {
        this.loadEvents()
    }
}
</script>

<style scoped lang="scss">
.image {
    margin: 0 auto; 
    overflow: hidden;
    border-radius: 50%;
    margin-bottom: 30px;
}
.loading-events {
    text-align: center;
    min-height: 200px;
    justify-content: center;
    align-items: center;
    display: flex;
}
.errors {
    padding: 10px;
    text-align: center;
    width: 100%;
    span {
        padding: 10px;
        background: #ccc;
        font-size: 18px;
        text-align: center;
    }
}
.events {
    width: 100%;
    margin-bottom: 20px;
    li a {
        display: flex;
        padding: 10px; 
        width: 100%;
        background: #444;
        margin-bottom: 2px;
        color: white;
        &:hover {
            background: #777;
        }
    }
    .info {
        flex: 1;
        text-align: left;
        b {
            font-size: 15px;
        }
        span {
            display: block;
        }
        .datetime {
            color: #ccc;
        }
    }
    .attendees {
        justify-content: center;
        align-items: center;
        display: flex;
    }
}
</style>