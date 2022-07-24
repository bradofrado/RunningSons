const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const multer = require('multer');

const env = require('./env.js');
const uploader = require('./uploader.js');
const path = '/images/merchandiseTypes/';

const upload = uploader.upload('/images/merchandiseTypes').single('image');

const merchandiseTypeSchema = new mongoose.Schema({
    type: String,
    name: String,
    image: String,
    isDeleted: {
        type: Boolean,
        default: false
    }
});

const MerchandiseType = mongoose.model('MerchandiseType', merchandiseTypeSchema);

const users = require('./users.js');
const validUser = users.valid;

router.get('/', async (req, res) => {
    try {
        const merchandiseTypes = await MerchandiseType.find();

        res.send(merchandiseTypes);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get('/:type', async (req, res) => {
    try {
        const merchandiseType = await MerchandiseType.findOne({
            type: req.params.type
        });

        if (!merchandiseType) {
            console.log("Could not find merchandise type with type " + req.params.type);
            return res.status(400).send({
                message: "Could not find merchandise type with type " + req.params.type
            });
        }

        res.send(merchandiseType);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post('/', validUser(['admin']), upload, async (req, res) => {
    if (!req.body.name ||  !req.body.type || !req.file) {
        if (req.file) {
            uploader.delete(path + '/' + req.file.filename);
        }
        return res.status(400).send({
            message: "Name and type and image are required"
        });
    }
    try {
        const merchandiseType = new MerchandiseType({
            name: req.body.name,
            type: req.body.type,
            image: path + req.file.filename,            
        });

        await merchandiseType.save();

        res.send(merchandiseType);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.put('/:id', validUser(['admin']), upload, async (req, res) => {
    try {
        if (!req.body.name ||  !req.body.type) {
            if (req.file) {
                uploader.delete(path + '/' + req.file.filename);
            }
            return res.status(400).send({
                message: "Name and type are required"
            });
        }

        const merchandiseType = await MerchandiseType.findOne({
            _id: req.params.id              
        });   
        

        if (!merchandiseType) {
            console.log('Could not find merchandise type with id ');
            return res.status(400).send({
                message: "Could not find merchandise type with id "
            });
        }

        const oldImage = merchandiseType.image;

        merchandiseType.name = req.body.name;
        merchandiseType.type = req.body.type;
        merchandiseType.image = req.file ? path + req.file.filename : merchandiseType.image;  

        if (oldImage != merchandiseType.image) {
            uploader.delete(oldImage);
        }
        await merchandiseType.save();

        console.log('Edited merchandise ' + merchandiseType._id);
    
        res.send(merchandiseType);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.delete('/:id', validUser(['admin']), async (req, res) => {
    try {
        const isAdmin = req.user.roles.includes('admin');

        let merchandiseType;
        
        merchandiseType = await MerchandiseType.findOne({
            _id: req.params.id                
        });

        if (!merchandiseType) {
            console.log("Could not find merchandise type with id " + req.params.id)
            return res.status(400).send({
                message: "Could not find merchandise type with id " + req.params.id
            });
        }

        //Admins can do hard deletes. Other wise just mark it as deleted
        if (req.query.hard === 'true') {
            if (isAdmin) {
                uploader.delete(merchandiseType.image);
                await merchandiseType.delete();
                console.log('Hard deleted merchandise type ' + merchandiseType._id);            
            } else {
                console.log("Only admins can do a hard delete for bookings");
                return res.status(400).send({
                    message: "Only admins can do a hard delete"
                });
            }
        } else {
            merchandiseType.isDeleted = true;
            await merchandiseType.save();
            console.log('Deleted merchandise type ' + merchandiseType._id);            
        }

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

module.exports = {
    routes: router,
    model: MerchandiseType
}