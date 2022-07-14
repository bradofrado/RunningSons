<template>
<div>
    <div ref="card"></div>
    <button class="button button-primary" @click="purchase">Purchase</button>
</div>
</template>

<script>
import axios from 'axios';

let stripe = window.Stripe(`pk_test_51LKwWoBXqDku0t2IgfMlmC7sQuAWCAKD9CAr9m96m2VuvFoNzs72iizZhUX8rfDAqku0WeDR4H20nN7xhWb10xQx00SwIhCiyz`),
    elements;
    //card;

export default {
    name: "CardElement",
    data() {
        return {
            clientSecret: null,
            card: null
        }
    },
    async mounted() {
        await this.initialize();
    },
    methods: {
        async initialize() {
            try {
                const response = await axios.post('/api/payments/create-payment-intent');
                let clientSecret = response.data.clientSecret;
                const appearance = {
                    theme: 'flat',
                };
                console.log(clientSecret);
                elements = stripe.elements({ clientSecret, appearance });
                this.card = elements.create('payment');
                this.card.mount(this.$refs.card);
            } catch(error) {
                console.log(error);
            }
        },
        async purchase() {
            
            //let self = this;

            // const result = await stripe.createToken(this.card);
            // if (result.error) {
            //     self.$forceUpdate(); // Forcing the DOM to update so the Stripe Element can update.
            //     return;
            // }
            // console.log(result.token);
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                // Make sure to change this to your payment completion page
                    return_url: "http://localhost:8080/music",
                },
            });
            console.log(error);
            
        }
    }
};
</script>