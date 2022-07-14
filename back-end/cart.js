const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const merchandise = require('./merchandise.js');

const cartItemSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.ObjectId,
        ref: 'Merchandise'
    },
    quantity: Number,
    isDeleted: {
        type: Boolean,
        default: false
    }
});

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

cartItemSchema.methods.populateMerchandise = async function() {
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
    this.where({isDeleted: false});
});

cartItemSchema.post(/^find|save/, async function(docs, next) {
    if (docs) {
        if (!Array.isArray(docs)) {
            docs = [docs];
        }

        for (let doc of docs) {
            await doc.populateMerchandise();
        }
    }

    next();
});


const CartItem = mongoose.model("CartItem", cartItemSchema);

const NotFoundMessage = (id) => {
    return "Could not find cart item with id " + id;
}

router.get('/', async (req, res) => {
    try {
        let items = await CartItem.find();
        
        res.send(items);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const item = await CartItem.findOne({
            _id: req.params.id,
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
    if (!req.body.item || !req.body.quantity) {
        return res.status(400).send({
            message: "Invalid body parameters"
        })
    }
    try {
        const item = new CartItem({
            item: req.body.item,
            quantity: req.body.quantity
        });

        await item.save();

        res.send(item);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
})

router.put('/:id', async (req, res) => {
    if (!req.ody.quantity) {
        return res.status(400).send({
            message: "Invalid body parameters"
        })
    }
    try {
        const item = await CartItem.findOne({
            _id: req.params.id
        });

        if (!item) {
            console.log(NotFoundMessage(req.params.id));
            return res.status(400).send({
                message: NotFoundMessage(req.params.id)
            })
        }

        item.item = req.body.item ?? item.item;
        item.quantity = req.body.quantity;

        await item.save();

        res.send(item);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const item = await CartItem.findOne({
            _id: req.params.id
        });

        if (!item) {
            console.log(NotFoundMessage(req.params.id));
            return res.status(400).send({
                message: NotFoundMessage(req.params.id)
            })
        }

        item.isDeleted = true;

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