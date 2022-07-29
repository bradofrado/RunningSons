<template>
<div>
    <div ref="card"></div>
    <p v-if="error" class="danger">{{error}}</p>
    <button class="button button-primary mt-3" @click="purchase" v-spinner="loading">Purchase</button>
</div>
</template>

<script>
import axios from 'axios';

let stripe = window.Stripe(process.env.VUE_APP_STRIPE_KEY),
    elements;
    //card;

export default {
    name: "CardElement",
    props: {
        address: Object,
        contact: Object,
    },
    data() {
        return {
            clientSecret: null,
            card: null,
            loading: false,
            error: null
        }
    },
    async mounted() {
        await this.getClient();
    },
    watch: {
        // async address() {
        //     await this.updateClient();
        // },
        // async contact() {
        //     await this.updateClient();
        // }
    },
    methods: {
        async getClient() {
            try {
                const response = await axios.post('/api/payments/create-payment-intent');
                let clientSecret = response.data.clientSecret;
                
                this.buildElement(clientSecret);
            } catch(error) {
                console.log(error);
            }
        },
        async updateClient() {
            try {
                await axios.put('/api/payments/create-payment-intent', {
                    address: this.address,
                    name: `${this.contact.firstname} ${this.contact.lastname}`,
                    email: this.contact.email,
                });
                //let clientSecret = response.data.clientSecret;
                
                //this.buildElement(clientSecret);
            } catch(error) {
                console.log(error);
            }
        },
        buildElement(clientSecret) {
            console.log(clientSecret);
            const appearance = {
                theme: 'flat',
                variables: {
                    fontFamily: "'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif"
                }
            };
            console.log(clientSecret);
            elements = stripe.elements({ clientSecret, appearance });
            this.card = elements.create('payment');
            this.card.mount(this.$refs.card);
        },
        async purchase() {
            
            try {
                if (!this.validate(this.address, ['line2']) || !this.validate(this.contact)) {
                    this.error = "Please fill out all fields";
                    return;
                }
                this.loading = true;
                await axios.put('/api/payments/create-payment-intent', {
                    address: this.address,
                    name: `${this.contact.firstname} ${this.contact.lastname}`,
                    email: this.contact.email,
                });

                const { error } = await stripe.confirmPayment({
                    elements, 
                    redirect: 'if_required'                   
                    // confirmParams: {
                    // // Make sure to change this to your payment completion page
                    //     return_url: "http://localhost:8080/cart",
                    // },
                });

                if (!error) {
                    await axios.post('/api/payments');
                    window.location = '/cart';
                }
                this.error = error.message;
                this.loading = false;
            } catch(error) {
                this.loading = false;
                console.log(error);
            }
        },
        validate(obj, notInclude) {
            if (!obj) return false;

            for (let name in obj) {
                if (!obj[name] && !notInclude.includes(name)) return false;
            }

            return true;
        }
    }
};
</script>

<style scoped>

</style>