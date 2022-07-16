<template>
<div>
    <h1>Sign Up</h1>
    <form class="signup-container" @submit.prevent="signup">
        <input class="input" v-model="firstname" v-invalid="firstnameValid !== null && errorText" placeholder="First Name"/>
        <input class="input" v-model="lastname" v-invalid="lastnameValid !== null && errorText" placeholder="Last Name"/>
        <input class="input grid-1-1" v-model="email" v-invalid="emailValid !== null && errorText" placeholder="Email"/>
        <input class="input grid-1-1" v-model="username" v-invalid="usernameValid !== null && errorText" placeholder="Username"/>
        <input type="password" class="input grid-1-1" v-model="password" v-invalid="passwordValid !== null && errorText" placeholder="Password"/>
        <input type="password" class="input grid-1-1" v-model="repassword" v-invalid="repasswordValid !== null && errorText" placeholder="Re-type Password"/>
        <p v-if="errorText" class="danger grid-1-1">{{errorText}}</p>
        <button class="button button-primary grid-1-1" type="submit" v-spinner="loading">Sign up</button>
    </form>
    <p>Already have an account? <router-link to="/account/login">Login</router-link></p>
</div>
</template>

<script>
import axios from 'axios';

export default {
    name: "LoginView",
    data() {
        return {
            firstname: null,
            lastname: null,
            email: null,
            username: null,
            password: null,
            repassword: null,
            loading: false,
            errorText: null
        }
    },
    computed: {
        firstnameValid() {
            return !this.firstname ? 'Please enter firstname' : null;
        }, 
        lastnameValid() {
            return !this.lastname ? 'Please enter lastname' : null;
        }, 
        emailValid() {
            return !this.email ? 'Please enter email' : null;
        }, 
        usernameValid() {
            return !this.username ? 'Please enter username' : null;
        }, 
        passwordValid() {
            return !this.password ? 'Please enter password' : null;
        }, 
        repasswordValid() {
            if (!this.repassword) {
                return 'Please enter repassword';
            } 

            if (this.password && this.repassword !== this.password) {
                return 'Password must be the same';
            }

            return null;
        }, 
        formValid() {
            return this.firstnameValid || this.lastnameValid || this.emailValid || this.usernameValid || this.passwordValid || this.repasswordValid || null;
        }
    },
    methods: {
        async signup() {
            if (this.formValid) {
                this.errorText = this.formValid;
                return;
            }

            try {
                this.loading = true;
                const response = await axios.post('/api/users', {
                    firstname: this.firstname,
                    lastname: this.lastname,
                    email: this.email,
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
.signup-container {
    max-width: 80%;
    margin: auto;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto auto;
    grid-gap: 10px;
}

.grid-1-1 {
    grid-column: 1/3;
}

@media only screen and (min-width: 960px) {
    .signup-container {
       max-width: 50%;
    }
}
</style>