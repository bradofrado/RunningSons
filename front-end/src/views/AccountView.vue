<template>
<div v-if="user">
    <h1>Welcome, {{user.firstname}}</h1>
    <a href="" @click="logout">Logout</a>
</div>
</template>

<script>
import axios from 'axios';

export default {
    name: "AccountView",
    async created() {
        try {
            if (!this.$root.$data.user) {
                let response = await axios.get('/api/users');
                this.$root.$data.user = response.data.user;
            }
            
        } catch(error) {
            this.$root.$data.user = null;

            window.location = '/account/login';
        }
    },
    methods: {
    async logout () {
            try {
                await axios.delete('/api/users');
                this.$root.$data.user = null;
            } catch(error) {
                console.log(error);
            }
        },
    },
    computed: {
        user() {
            return this.$root.$data.user;
        }
    }
}
</script>