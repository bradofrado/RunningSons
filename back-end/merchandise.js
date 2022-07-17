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


merchandiseSchema.methods.populateType = async function() {
    if (mongoose.isValidObjectId(this.type)) {
        const type = await MerchandiseType.findOne({
            _id: this.type
        });

        if (type) {
            this.type = type;
        }
    } 
}

merchandiseSchema.pre(/^find/, function() {
    this.where({isDeleted: false});
});

merchandiseSchema.post('find', async function(docs, next) {
    for(let doc of docs) {
        await doc.populateType();
    }

    next();
});

merchandiseSchema.post('findOne', async function(doc, next) {
    if (doc) {
        await doc.populateType();
    }

    next();
})

merchandiseSchema.methods.toJSON = function() {
    var obj = this.toObject();

    if (obj.type && obj.type.type) {
        obj.type = obj.type.type;
    }

    delete obj.isDeleted;

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

        let merchandise = await Merchandise.find();

        merchandise = merchandise.filter(m => m.type.type == req.params.type);

        if (!merchandise || !merchandise.length) {
            console.log("Could not find merchandise with type " + req.params.type);
            return res.status(400).send({
                message: "Could not find merchandise with type " + req.params.type
            });
        }

        res.send(merchandise);
        
    } catch(error) {
        console.log(error);
    }
});

router.get('/:name', async (req, res) => {
    try {
        const merchItem = await Merchandise.findOne({
            name: req.params.name
        });

        if (!merchItem) {
            console.log("Could not find merchandise item with name " + req.params.name);
            return res.status(400).send({
                message: "Could not find merchandise item with name " + req.params.name
            });
        }

        res.send(merchItem);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post('/', validUser(['admin']), upload.single('image'), async (req, res) => {
    if (!req.body.name ||  !req.body.price || !req.body.type) {
        return res.status(400).send({
            message: "Name and price are required"
        });
    }
    try {
        const merchandiseType = await MerchandiseType.findOne({
            type: req.body.type
        });

        if (!merchandiseType) {
            return res.status(400).send({
                message: "Could not find the merchandise type " + req.body.type
            })
        }
        const merchandise = new Merchandise({
            name: req.body.name,
            description: req.body.description,
            image: req.file ? '/images/' + req.file.filename : null,
            price: req.body.price,
            type: merchandiseType._id
        });

        await merchandise.save();

        res.send(merchandise);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.put('/:id', validUser(['admin']), upload.single('image'), async (req, res) => {
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

        merchandise.name = req.body.name;
        merchandise.price = req.body.price;
        merchandise.description = req.body.description ?? merchandise.description;
        merchandise.image = req.file ? '/images/' + req.file.name : merchandise.image;

        await merchandise.save();

        console.log('Edited merchandise ' + merchandise._id);
    
        res.send(merchandise);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.delete('/:id', validUser(['admin']), async (req, res) => {
    try {
        const isAdmin = req.user.roles.includes('admin');

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