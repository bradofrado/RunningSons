<template>
<div v-if="user">
    <h1>Welcome, {{user.firstname}}</h1>
    <a href="" @click.prevent="logout" class="a">Logout</a>
    <admin-view v-if="isAdmin"/>
</div>
<login-view v-else/>
</template>

<script>
import axios from 'axios';
import LoginView from './LoginView.vue';
import AdminView from './AdminView.vue';

export default {
    name: "AccountView",
    components: {
        LoginView,
        AdminView
    },
    async created() {
        try {
            let response = await axios.get('/api/users');
                
            this.$root.$data.user = response.data.user;

            await this.$root.getCartAmount();
        } catch(error) {
            this.$root.$data.user = null;
        }
    },
    computed: {
        isAdmin() {
            return this.user.roles.includes('admin');
        },
        user() {
            return this.$root.$data.user;
        }
    },
    methods: {
        
        async logout () {
            try {
                await axios.delete('/api/users');
                this.$root.$data.user = null;

                await this.$root.getCartAmount();
            } catch {
                //
            }
        },
    }
}
</script>

<style scoped>
.item {
    margin-top: 30px;
}
</style>