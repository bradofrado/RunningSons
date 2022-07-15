const express = require('express');

const user = require('./users.js');
const validUser = user.valid;

const cart = require('./cart.js');

const router = express.Router();
const stripe = require("stripe")('sk_test_51LKwWoBXqDku0t2IqIBSAtSq6qCsXOOcVT1yCw9B4DkGSAymFCo0f1IkavOKONVxbhyekTEUA1EzRuUBpDDJWoYE00IVnboIS8');

const getPaymentAmount = async function(user) {
    const items = await cart.model.find({
        user: user
    });

    if (!items.length) {
        return 0;
    }

    let price = items.reduce((prev, curr) => {
        return prev + curr.quantity * curr.item.price;
    }, 0);

    return parseInt(price * 100);
}

router.post('/', validUser, async (req, res) => {
    try {
        const items = await cart.model.find({
            user: req.user
        });

        for (let item of items) {
            item.isDeleted = true;
            await item.save();
        }

        req.user.clientSecret = null;

        await req.user.save();

        res.sendStatus(200);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
})

router.post("/create-payment-intent", validUser, async (req, res) => {
    const { items } = req.body;
    try {
        // let clientSecret = req.user.clientSecret;
        let amount = await getPaymentAmount(req.user);
        if (!req.user.clientSecret && amount > 0) {
            
            // Create a PaymentIntent with the order amount and currency
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: "usd",
                automatic_payment_methods: {
                    enabled: true,
                },
            }); 

            clientSecret = paymentIntent.client_secret;
            req.user.clientSecret = paymentIntent.id;
            await req.user.save();
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
    try {
        let amount = await getPaymentAmount(req.user);
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.update(req.user.clientSecret, {
            amount: amount,
            currency: "usd",
            receipt_email: req.body.email,
            shipping: {
                address: req.body.address,
                name: req.body.name
            }
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