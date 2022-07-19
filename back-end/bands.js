const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const router = express.Router();
const path = '/images/bands';

const env = require('./env.js');

const upload = multer({
    dest: env.root+path,
    limits: {
        fileSize: 50000000
    }
});

const bandSchema = new mongoose.Schema({
    name: String,
    description: String,
    dateCreated: Date,
    image: String,
    isDeleted: {
        type: Boolean,
        default: false
    }
});

bandSchema.pre(/^find/, function() {
    this.where({isDeleted: false});
});

const Band = mongoose.model('Band', bandSchema);

const users = require('./users.js');
const validUser = users.valid;

router.get('/', async (req, res) => {
    try {
        const bands = await Band.find();

        res.send(bands);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post('/', validUser(['admin']), upload.single('image'), async(req, res) => {
    if (!req.body.name || !req.body.description) {
        console.log("Invalid body parameters");
        return res.status(400).send({
            message: "Invalid body parameters"
        })
    }

    try {
        const band = new Band({
            name: req.body.name,
            image: req.file ? path + '/' + req.file.filename : '',
            description: req.body.description,
            dateCreated: new Date()
        });

        await band.save();

        res.send(band);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
})

router.put('/:id', validUser(['admin']), upload.single('image'), async (req, res) => {
    if (!req.body.name || !req.body.description) {
        console.log("Invalid body parameters");
        return res.status(400).send({
            message: "Invalid body parameters"
        })
    }

    try {
        const band = await Band.findOne({
            _id: req.params.id              
        });   
        

        if (!band) {
            console.log('Could not find band with id ' + req.params.id);
            return res.status(400).send({
                message: "Could not find band with id " + req.params.id
            });
        }

        band.name = req.body.name,
        band.image = req.file ? path + '/' + req.file.filename : band.image,
        band.description = req.body.description,
        
        await band.save();

        console.log('Edited band ' + band._id);
    
        res.send(band);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.delete('/:id', validUser(['admin']), async (req, res) => {
    try {
        const band = await Band.findOne({
            _id: req.params.id                
        });

        if (!band) {
            console.log("Could not find band with id " + req.params.id)
            return res.status(400).send({
                message: "Could not find band with id " + req.params.id
            });
        }

        //Admins can do hard deletes. Other wise just mark it as deleted
        if (req.query.hard === 'true') {
            await band.delete();
            console.log('Hard deleted band ' + band._id);
        } else {
            band.isDeleted = true;
            await band.save();
            console.log('Deleted band ' + band._id);            
        }

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

module.exports = {
    routes: router,
    model: Band
}