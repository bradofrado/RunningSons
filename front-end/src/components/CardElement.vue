<template>
<div>
    <div ref="card"></div>
    <p v-if="error" class="danger">{{error}}</p>
    <button class="button button-primary mt-3" @click="purchase" v-spinner="loading">Purchase</button>
</div>
</template>

<script>
import axios from 'axios';

let stripe = window.Stripe(`pk_test_51LKwWoBXqDku0t2IgfMlmC7sQuAWCAKD9CAr9m96m2VuvFoNzs72iizZhUX8rfDAqku0WeDR4H20nN7xhWb10xQx00SwIhCiyz`),
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
        }
    }
};
</script>

<style scoped>

</style>