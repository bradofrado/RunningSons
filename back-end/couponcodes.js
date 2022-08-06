const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const validUser = require('./users.js').valid;
const Cart = require('./cart.js').model;

const util = require('./util.js');

const multer = require('multer');
const parseForm = multer().none();

const isNumber = function(n) {
    if (typeof n === 'string') 
        return /^\d*$/.test(n);
    return typeof n === 'number';
}

const opts = { toJSON: { virtuals: true } };
const couponCodesSchema = new mongoose.Schema({
    code: String,
    dateExpiration: Date,
    limit: {
        type: Number,
        default: 1
    },
    itemType: {
        type: String,
        //totals: value taken off the total amount
        //shipping: value taken off shipping
        //1: value taken off the most expensive item. 
        //2: value taken off the second most expensive item
        //3: value taken off the third most expensive item
        //enum: ['totals', 'shipping', '1', '2', '3']
        validate: function(v) {
            //Returns true if this is a number
            if (isNumber(v)) {
                return true;
            }

            return ['totals', 'shipping'].includes(v);
        }
    },
    valueType: {
        type: String,
        //fixed: a set amount taken off like $10 off. Can't exceed the type
        //percentage: a percentage like %50 off of the type
        enum: ['fixed', 'percentage'],
        default: 'fixed'
    },
    value: {
        type: Number,
        validate: function(v) {
            if (!isNumber(v)) return false;

            if (this.valueType === 'percentage') {
                return v >= 0 && v <= 1;
            }

            return v >= 0;
        }
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
    //Example pairs: totals:fixed - take a certain amount off the total up until the full price
    //totals:percentage - take a percentage off the total until the full price
    //shipping:fixed - take a fixed amount off the shipping until the whole shipping price
    //shipping:percentage - take a percentage off the shipping until the whole shipping price
    //1:fixed - take a fixed amount off the most expensive item until the whole item price
    //2:fixed - buy one get one x amount off
    //2:percentage - buy one get one x percentage off
    //3:percentage - buy two get one x percentage off
}, opts);


//type = itemType:valueType
couponCodesSchema.virtual('type').get(function() {
    return `${this.itemType}:${this.valueType}`;
}).set(function(v) {
    const [itemType, valueType] = v.split(':');
    this.set({itemType});

    if (valueType) {
        this.set({valueType});
    }
});

couponCodesSchema.virtual('name').get(function() {
    return this.code;
})


//Filter out the deleted coupons
couponCodesSchema.pre(/^find/, function() {
    this.where({isDeleted: false, dateExpiration: { $gte: new Date() }});
});

couponCodesSchema.methods.getValue = function(items, pastAmount) {
    let totalAmount = 0;
    switch(this.itemType) {
        case 'totals':
            totalAmount = util.getItemsAmount(items);
            break;
        case 'shipping':
            totalAmount = util.shipping;
            break;
        //If it is a number, then it is a buy x get one free, or whatever value type is
        default:
            const type = parseInt(this.itemType);
            if (isNaN(type)) {
                throw new Error('Invalid coupon item type');
            }

            //sort the items by price descending so we know which item we are grabbing
            items = items.sort((a, b) => b.item.price - a.item.price);
            
            //Each item has a quantity, and we want to get the true first, second, etc.
            //so split up all of the items by their quantities
            const merchItems = [];
            for (let item of items) {
                for (let i = 0; i < item.quantity; i++) {
                    merchItems.push(item.item.price);
                }
            }

            //We need to get the nth item, so if that doesn't exist then this
            //coupon doesn't apply
            if (type > merchItems.length) {
                break;
            }

            //type - 1 because type is not zero based
            totalAmount = merchItems[type - 1];
            break;
    }

    let couponAmount = 0;
    switch (this.valueType) {
        case 'fixed':
            couponAmount = this.value;
            break;
        case 'percentage':
            couponAmount = this.value * totalAmount;
            break;
        default:
            throw new Error("Invalid coupon value type");
    }

    //If, for example, the total is $8 but the coupon is $10 off, we don't want to return 
    //$10 for the coupon, just the $8 of whats rest of the total
    couponAmount = totalAmount - couponAmount > 0 ? couponAmount : totalAmount;

    return (pastAmount - couponAmount > 1 ? couponAmount : pastAmount - 1).toFixed(2);
}

const Code = mongoose.model('CouponCode', couponCodesSchema);

router.get('/', validUser(['admin']), async (req, res) => {
    try {
        const codes = await Code.find();

        res.send(codes); 
    } catch(error) {
        console.log(error);
    }
});

router.get('/apply', validUser, async (req, res) => {
    try {
        //Get all of the codes associated with this user
        const codes = await req.user.getCodes(Code, false);

        //Get the code values based on the cart items
        const items = await Cart.find({
            user: req.user
        });

        let amount = util.getItemsAmount(items);
        for (let {code} of codes) {
            code.value = code.getValue(items, amount);
            amount -= code.value;
        }

        res.send(codes);
    } catch(error) {
        console.log(error);
    }
});

router.post('/', validUser(['admin']), parseForm, async (req, res) => {
    if (!req.body.code || !req.body.dateExpiration || !req.body.value || !req.body.type || !req.body.limit) {
        return res.status(400).send({
            message: "Invalid body parameters"
        })
    }

    try {
        const code = new Code({
            code: req.body.code,
            dateExpiration: req.body.dateExpiration,
            value: req.body.value,
            type: req.body.type,
            limit: req.body.limit
        });

        await code.save();

        res.send(code);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post('/apply', validUser, async (req, res) => {
    if (!req.body.code) {
        return res.status(400).send({
            message: "Invalid body parameters"
        })
    }

    try {
        let code = await Code.findOne({
            code: req.body.code
        });

        if (!code) {
            //TOOD: return correct status
            return res.status(406).send({
                message: "Invalid code"
            })
        }

        //If the user has already hit the limit of this code,
        //don't let them use it again
        if (code.limit > 0 && (await req.user.codeApplied(Code, req.body.code)) >= code.limit) {
            return res.status(400).send({
                message: "Code was already applied"
            })
        }

        //Check to see if the code acually does anything
        const items = await Cart.find({
            user: req.user
        });
        if (code.getValue(items) <= 0) {
            return res.status(400).send({
                message: "Code does not apply"
            })
        }

        req.user.codes.push({code});

        
        await req.user.save();

        res.send(code);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
})

router.put('/:id', validUser(['admin']), parseForm, async (req, res) => {
    if (!req.body.code || !req.body.dateExpiration || !req.body.value || !req.body.type || !req.body.limit) {
        return res.status(400).send({
            message: "Invalid body parameters"
        })
    }

    try {
        const code = await Code.findOne({
            _id: req.params.id
        });

        if (!code) {
            return res.status(400).send({
                message: "Cannot find code with id " + req.params.id
            });
        }

        code.code = req.body.code;
        code.dateExpiration = req.body.dateExpiration;
        code.value = req.body.value;
        code.type = req.body.type;
        code.limit = req.body.limit;
        
        await code.save();

        res.send(code);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.delete('/:id', validUser(['admin']), async (req, res) => {
    try {
        const code = await Code.findOne({
            _id: req.params.id
        });

        if (!code) {
            return res.status(400).send({
                message: "Cannot find code with id " + req.params.id
            });
        }

        if (req.query.hard === 'true') {
            await code.delete();
            console.log('Hard deleted code ' + code._id);
        } else {
            code.isDeleted = true;
            await code.save();
            console.log('Deleted code ' + code._id);            
        }

        res.sendStatus(200);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.delete('/apply/:id', validUser, async (req, res) => {
    try {
        await req.user.removeCode(req.params.id);
        res.sendStatus(200);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
})

module.exports = {
    model: Code,
    routes: router
}