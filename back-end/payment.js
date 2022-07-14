const express = require('express');
//const mongoose = require('mongoose');

const router = express.Router();
const stripe = require("stripe")('sk_test_51LKwWoBXqDku0t2IqIBSAtSq6qCsXOOcVT1yCw9B4DkGSAymFCo0f1IkavOKONVxbhyekTEUA1EzRuUBpDDJWoYE00IVnboIS8');

router.post("/create-payment-intent", async (req, res) => {
    const { items } = req.body;
  
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1400,
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        },
    });
  
    res.send({
        clientSecret: paymentIntent.client_secret,
    });
  });

module.exports = {
    routes: router
}