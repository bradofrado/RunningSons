const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const validUser = require('./users.js').valid;

const multer = require('multer');
const parseForm = multer().none();

const couponCodesSchema = new mongoose.Schema({
    code: String,
    dateExpiration: Date,
    value: Number,
    type: String
});

//Filter out the deleted coupons
couponCodesSchema.pre(/^find/, function() {
    this.where({isDeleted: false, dateExpiration: { $gte: new Date() }});
});

const Code = mongoose.model('CouponCode', couponCodesSchema);

router.get('/', validUser(['admin']), async (req, res) => {
    try {
        const codes = await Code.find();

        res.send(codes); 
    } catch(error) {
        console.log(error);
    }
});

router.get('/applied', validUser, async (req, res) => {
    try {
        const codes = await req.user.getCodes(Code, false);

        res.send(codes);
    } catch(error) {
        console.log(error);
    }
});

router.post('/', validUser(['admin']), parseForm, async (req, res) => {
    if (!req.body.code || !req.body.dateExpiration || !req.body.value || !req.body.type) {
        return res.status(400).send({
            message: "Invalid body parameters"
        })
    }

    try {
        const code = new Code({
            code: req.body.code,
            dateExpiration: req.body.dateExpiration,
            value: req.body.value,
            type: req.body.type
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

        //If the user has already applied this code and checked out with it,
        //don't let them use it again
        if (await req.user.codeApplied(Code, req.body.code)) {
            return res.status(400).send({
                message: "Codes was already applied"
            })
        }

        //If the user has already applied this code (but not checked out), don't apply
        //again
        if (!await req.user.hasCode(Code, req.body.code)) {
            req.user.codes.push({code});
        }

        
        await req.user.save();

        res.send(code);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
})

router.put('/:id', validUser(['admin']), parseForm, async (req, res) => {
    if (!req.body.code || !req.body.dateExpiration || !req.body.value || !req.body.type) {
        return res.status(400).send({
            message: "Invalid body parameters"
        })
    }

    try {
        const code = await Code.findOne({
            code: req.params.id
        });

        if (!code) {
            return res.status(400).send({
                message: "Cannot find code with id " + req.params.id
            });
        }

        code.code = req.body.code,
        code.dateExpiration = req.body.dateExpiration,
        code.value = req.body.value,
        code.type = req.body.type
        
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
            code: req.params.id
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
})

module.exports = {
    model: Code,
    routes: router
}