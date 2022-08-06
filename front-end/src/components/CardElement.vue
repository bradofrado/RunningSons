<template>
    <div ref="card"></div>
</template>

<script>
import axios from 'axios';

let stripe = window.Stripe(process.env.VUE_APP_STRIPE_KEY),
    elements;
    //card;

export default {
    name: "CardElement",
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
    methods: {
        async getClient() {
            try {
                const response = await axios.post('/api/payments/create-payment-intent');
                let clientSecret = response.data.clientSecret;
                
                this.buildElement(clientSecret);
            } catch(error) {
                if (error.response && error.response.data.message) {
                    this.$emit('error', error.response.data.message);
                }         
            }
        },
        buildElement(clientSecret) {
            const appearance = {
                theme: 'flat',
                variables: {
                    fontFamily: "'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif"
                }
            };
            elements = stripe.elements({ clientSecret, appearance });
            this.card = elements.create('payment');
            this.card.mount(this.$refs.card);
        },
        async purchase(address, contact) {
            
            try {                
                await axios.put('/api/payments/create-payment-intent', {
                    address: address,
                    name: `${contact.firstname} ${contact.lastname}`,
                    email: contact.email,
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
                this.$emit('error', error.message);
                return false;
            } catch(error) {
                if (error.response && error.response.data.message) {
                    this.$emit('error', error.response.data.message);
                    return false;
                }         
            }
        },
    }
};
</script>

<style scoped>

</style>