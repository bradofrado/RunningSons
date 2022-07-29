require('dotenv').config({ path: '../.env' });

export default {
    port: process.env.SERVER_PORT,
    stripeKey: process.env.STRIPE_KEY
}