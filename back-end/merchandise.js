const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const multer = require('multer');

const env = require('./env.js');
const root = env.root;

const upload = multer({
    dest: root+'/images/',
    limits: {
        fileSize: 50000000
    }
});

const MerchandiseType = require('./merchandise-types.js').model;

const merchandiseSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    image: String,
    type: {
        type: mongoose.Schema.ObjectId,
        ref: "MerchandiseType"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

merchandiseSchema.methods.toJSONAsync = async function() {
    var obj = this.toObject();

    if (mongoose.isValidObjectId(obj.type)) {
        const type = await MerchandiseType.findOne({
            _id: obj.type
        });

        if (type) {
            obj.type = type.type;
        }
    } else {
        obj.type = obj.type.type;
    }
    return obj;
}


const Merchandise = mongoose.model('Merchandise', merchandiseSchema);

const users = require('./users.js');
const validUser = users.valid;

router.get('/', async (req, res) => {
    try {
        const merchandise = await Merchandise.find();

        res.send(merchandise);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get('/type/:type', async (req, res) => {
    try {
        // const merchandise = await Merchandise.aggregate([
        //     {
        //         $unwind: "$type"
        //     },
        //     {
        //       $lookup: {
        //         from: "merchandisetype",
        //         localField: "type",
        //         foreignField: "_id",
        //         as: "type",
        //       },
        //     },
        //     {
        //       $match: {
        //         "type.type": req.params.type,
        //       },
        //     },
        //   ])

        Merchandise.find().populate('type').exec((err, merchandise) => {
            if (err) throw err;

            merchandise = merchandise.filter(m => m.type.type == req.params.type);

            if (!merchandise || !merchandise.length) {
                console.log("Could not find merchandise with type " + req.params.type);
                return res.status(400).send({
                    message: "Could not find merchandise with type " + req.params.type
                });
            }
    
            res.send(merchandise);
        });
        
    } catch(error) {
        console.log(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const merchItem = await Merchandise.findOne({
            _id: req.params.id
        });

        if (!merchItem) {
            console.log("Could not find merchandise item with id " + req.params.id);
            return res.status(400).send({
                message: "Could not find merchandise item with id " + req.params.id
            });
        }

        res.send(merchItem);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post('/', validUser(['Admin']), upload.single('merchandise'), async (req, res) => {
    if (!req.body.name ||  !req.body.price || !req.file) {
        return res.status(400).send({
            message: "Name and price and image are required"
        });
    }
    try {
        const merchandise = new Merchandise({
            name: req.body.name,
            description: req.body.description,
            image: '/images/' + req.file.filename,
            price: req.body.price,
            type: req.body.type
        });

        await merchandise.save();

        res.send(merchandise);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.put('/:id', validUser(['Admin']), async (req, res) => {
    try {
        if (!req.body.name ||  !req.body.price) {
            return res.status(400).send({
                message: "Name and price are required"
            });
        }

        const merchandise = await Merchandise.findOne({
            _id: req.params.id              
        });   
        

        if (!merchandise) {
            console.log('Could not find merchandise with id ');
            return res.status(400).send({
                message: "Could not find merchandise with id "
            });
        }

        await merchandise.save();

        console.log('Edited merchandise ' + merchandise._id);
    
        res.send(merchandise);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.delete('/:id', validUser(['Admin']), async (req, res) => {
    try {
        const isAdmin = req.user.roles.includes('Admin');

        let merchandise;
        
        merchandise = await Merchandise.findOne({
            _id: req.params.id                
        });

        if (!merchandise) {
            console.log("Could not find merchandise with id " + req.params.id)
            return res.status(400).send({
                message: "Could not find merchandise with id " + req.params.id
            });
        }

        //Admins can do hard deletes. Other wise just mark it as deleted
        if (req.query.hard === 'true') {
            if (isAdmin) {
                await merchandise.delete();
                console.log('Hard deleted merchandise ' + merchandise._id);            
            } else {
                console.log("Only admins can do a hard delete for bookings");
                return res.status(400).send({
                    message: "Only admins can do a hard delete"
                });
            }
        } else {
            merchandise.isDeleted = true;
            await merchandise.save();
            console.log('Deleted merchandise ' + merchandise._id);            
        }

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

module.exports = {
    routes: router,
    model: Merchandise
}