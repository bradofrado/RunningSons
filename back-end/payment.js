const express = require('express');
const mongoose = require('mongoose');

const user = require('./users.js');
const validUser = user.valid;

const cart = require('./cart.js');

const router = express.Router();
const stripe = require("stripe")('sk_test_51LKwWoBXqDku0t2IqIBSAtSq6qCsXOOcVT1yCw9B4DkGSAymFCo0f1IkavOKONVxbhyekTEUA1EzRuUBpDDJWoYE00IVnboIS8');

const paymentSchema = new mongoose.Schema({
    amount: Number,
    shipping: Object,
    receipt_email: String,
    paymentId: String,
    dateBought: Date,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
});

const Payment = mongoose.model('Payment', paymentSchema);

const getPaymentAmount = async function(items) {
    const shipping = 5;
    if (!items.length) {
        return shipping * 100;
    }

    let price = items.reduce((prev, curr) => {
        return prev + curr.quantity * curr.item.price;
    }, 0);

    price += shipping;

    return parseInt(price * 100);
}

const getMetadata = async function(items) {
    const metadata = {};
    for (let item of items) {
        const name = item.item.name;
        const quantity = item.quantity;

        if (!metadata[name]) {
            metadata[name] = 0;
        }

        metadata[name] += quantity;
    }

    return metadata;
}

router.post('/', validUser, async (req, res) => {
    if (!req.user.clientSecret) {
        return res.status(400).send({
            message: "User pust have a payment"
        });
    }
    try {
        //Create a new payment object
        const paymentIntent = await stripe.paymentIntents.retrieve(req.user.clientSecret);

        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).send({
                message: "Payment must have status succeeded"
            });
        }

        const amount = paymentIntent.amount;
        const shipping = paymentIntent.shipping;
        const receipt_email = paymentIntent.receipt_email;
        const payment = new Payment({
            amount, shipping, receipt_email,
            dateBought: new Date(),
            user: req.user,
            paymentId: paymentIntent.id
        });
        await payment.save();

        //Make the cart items have bought status
        const items = await cart.model.find({
            user: req.user
        });

        for (let item of items) {
            item.bought = true;
            item.dateBought = new Date();
            await item.save();
        }

        req.user.clientSecret = null;
        await req.user.save();

        res.send(payment);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
})

router.post("/create-payment-intent", validUser, async (req, res) => {
    const { items } = req.body;
    try {
        const items = await cart.model.find({
            user: req.user
        });

        let amount = await getPaymentAmount(items);
        let metadata = await getMetadata(items);
        
        let clientSecret;
        if (!req.user.clientSecret && amount > 0) {
            
            // Create a PaymentIntent with the order amount and currency
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: "usd",
                automatic_payment_methods: {
                    enabled: true,
                },
                metadata: metadata
            }); 

            clientSecret = paymentIntent.client_secret;
            req.user.clientSecret = paymentIntent.id;
            await req.user.save();
        } else {
            const paymentIntent = await stripe.paymentIntents.retrieve(req.user.clientSecret);
            clientSecret = paymentIntent.client_secret;
        }

        res.send({
            clientSecret: clientSecret,
        });
    } catch(error) {
        console.log(error); 
        res.sendStatus(500);
    }
});

router.put("/create-payment-intent", validUser, async (req, res) => {
    if (!req.body.address || !req.body.email || !req.body.name) {
        return res.status(400).send({
            message: "Invalid body parameters"
        })
    }
    try {
        const items = await cart.model.find({
            user: req.user
        });

        let amount = await getPaymentAmount(items);
        let metadata = await getMetadata(items);
        // Update a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.update(req.user.clientSecret, {
            amount: amount,
            currency: "usd",
            receipt_email: req.body.email,
            shipping: {
                address: req.body.address,
                name: req.body.name
            },
            metadata: metadata
        });
    
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = {
    routes: router
}