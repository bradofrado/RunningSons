<template>
<div>
    <h1>Login</h1>
    <form class="login-container" @submit.prevent="login">
        <input class="input" v-model="username" placeholder="Email"/>
        <input type="password" class="input" v-model="password" placeholder="Password"/>
        <p v-if="errorText" class="danger">{{errorText}}</p>
        <button class="button button-primary" type="submit" v-spinner="loading">Login</button>
    </form>
    <p>Don't have an account? <router-link to="/account/signup" class="a">Sign up</router-link></p>
</div>
</template>

<script>
import axios from 'axios';

export default {
    name: "LoginView",
    data() {
        return {
            username: null,
            password: null,
            loading: false,
            errorText: null
        }
    },
    methods: {
        async login() {
            try {
                this.loading = true;
                const response = await axios.post('/api/users/login', {
                    username: this.username,
                    password: this.password
                });

                this.$root.$data.user = response.data.user;
                this.loading = false;
                this.errorText = '';
                window.location = '/account';
            } catch(error) {
                console.log(error);
                this.$root.$data.user = null;
                this.loading = false;

                if (error.response && error.response.data.message) {
                    this.errorText = error.response.data.message;
                }
            }
        }
    }
}
</script>

<style scoped>
.login-container {
    max-width: 80%;
    margin: auto;
    display: grid;
    grid-template-rows: auto auto auto;
    grid-row-gap: 10px;
}

@media only screen and (min-width: 960px) {
    .login-container {
       max-width: 50%;
    }
}
</style>