const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const merchandise = require('./merchandise.js');

const user = require('./users.js');
const valid = user.valid;

const opts = { toObject: { virtuals: true } };
const cartItemSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.ObjectId,
        ref: 'Merchandise'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    quantity: Number,
    size: String,
    dateCreated: Date,
    dateModified: Date,
    dateDeleted: Date,
    dateBought: Date,
    bought: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, opts);

cartItemSchema.virtual('total').get(function() {
    return this.item.price * this.quantity;
});
cartItemSchema.virtual('fullName').get(function() {
    return `${this.item.name} (${this.size})`;
})

cartItemSchema.methods.checkSize = async function(size) {
    if (!this.item.sizes) {
        await this.populate();
    }

    const sizes = Object.keys(this.item.sizes);

    return sizes.includes(size) && this.item.sizes[size] > 0;
}

cartItemSchema.methods.toJSON = function() {
    var obj = this.toObject();

    const id = obj._id;
    obj = Object.assign(obj, obj.item);
    obj._id = id;
    obj.merchItem = obj.item._id;
    obj.type = obj.type.type;

    delete obj.item;
    delete obj.isDeleted;

    return obj;
}

cartItemSchema.methods.populate = async function() {
    if (mongoose.isValidObjectId(this.item)) {
        const item = await merchandise.model.findOne({
            _id: this.item
        });

        if (item) {
            this.item = item;
        }
    }
}

cartItemSchema.pre(/^find/, function() {
    this.where({isDeleted: false, bought: false});
});

cartItemSchema.post(/^find|save/, async function(docs, next) {
    if (docs) {
        if (!Array.isArray(docs)) {
            docs = [docs];
        }

        for (let doc of docs) {
            await doc.populate();
        }
    }

    next();
});


const CartItem = mongoose.model("CartItem", cartItemSchema);

const NotFoundMessage = (id) => {
    return "Could not find cart item with id " + id;
}

router.get('/', valid, async (req, res) => {
    try {
        let items = await CartItem.find({
            user: req.user
        });
        
        res.send(items);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get('/amount', valid, async (req, res) => {
    try {
        let items = await CartItem.find({
            user: req.user
        });
        
        res.send({amount: items.length});
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get('/:id', valid, async (req, res) => {
    try {
        const item = await CartItem.findOne({
            _id: req.params.id,
            user: req.user
        });

        if (!item) {
            console.log(NotFoundMessage(req.params.id));
            return res.status(400).send({
                message: NotFoundMessage(req.params.id)
            })
        }

        res.send(item);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post('/', async (req, res) => {
    if (!req.body.item || !req.body.quantity || !req.body.size) {
        return res.status(400).send({
            message: "Invalid body parameters"
        })
    }
    try {
        if (!req.session.userID) {
            const _user = await user.newGuest();
            req.session.userID = _user._id;          
        }

        const item = new CartItem({
            item: req.body.item,
            quantity: req.body.quantity,
            size: req.body.size,
            user: req.session.userID,
            dateCreated: new Date()
        });

        if (!await item.checkSize(req.body.size)) {
            return res.status(400).send({
                message: 'Invalid size ' + req.body.size
            })
        }

        await item.save();

        res.send(item);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.put('/:id', valid, async (req, res) => {
    if (!req.body.quantity || !req.body.size) {
        return res.status(400).send({
            message: "Invalid body parameters"
        })
    }
    try {
        const item = await CartItem.findOne({
            _id: req.params.id,
            user: req.user
        });

        if (!item) {
            console.log(NotFoundMessage(req.params.id));
            return res.status(400).send({
                message: NotFoundMessage(req.params.id)
            })
        }

        item.item = req.body.item ?? item.item;
        item.quantity = req.body.quantity;
        item.size = req.body.size;
        item.dateModified = new Date();

        if (!await item.checkSize(req.body.size)) {
            return res.status(400).send({
                message: 'Invalid size ' + req.body.size
            })
        }

        await item.save();

        res.send(item);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.delete('/:id', valid, async (req, res) => {
    try {
        const item = await CartItem.findOne({
            _id: req.params.id,
            user: req.user
        });

        if (!item) {
            console.log(NotFoundMessage(req.params.id));
            return res.status(400).send({
                message: NotFoundMessage(req.params.id)
            })
        }

        item.isDeleted = true;
        item.dateDeleted = new Date();

        await item.save();

        res.send(item);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
})

module.exports = {
    routes: router,
    model: CartItem
}