const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const router = express.Router();
const path = '/images/albums';

const env = require('./env.js');

const Band = require('./bands.js').model;

const upload = multer({
    dest: env.root+path,
    limits: {
        fileSize: 50000000
    }
});

const albumSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    releaseDate: Date,
    band: {
        type: mongoose.Schema.ObjectId,
        ref: 'Band'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

albumSchema.methods.populate = async function() {
    if (mongoose.isValidObjectId(this.band)) {
        const band = await Band.findOne({
            _id: this.band
        });

        if (band) {
            this.band = band;
        }
    } 
}

albumSchema.methods.toJSON = function() {
    var obj = this.toObject();

    if (obj.band && obj.band.name) {
        obj.band = obj.band.name;
    }

    return obj;
}

//Filter out the deleted albums
albumSchema.pre(/^find/, function() {
    this.where({isDeleted: false});
});

//Populate the albums 
albumSchema.post(/^find/, async function(docs, next) {
    let items = docs;
    if (!Array.isArray(docs)) {
        items = [docs];
    }

    for (let item of items) {
        await item.populate();
    }

    next();
})

const Album = mongoose.model('Album', albumSchema);

const users = require('./users.js');
const validUser = users.valid;

router.get('/', async (req, res) => {
    try {
        const {album, band} = req.query;

        let albums;
        if (album) {
            albums = await Album.find({
                title: album
            });
        } else {
            albums = await Album.find();
        }

        if (band) {
            albums = albums.filter(x => x.band.name === band);
        }

        res.send(albums);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post('/', validUser(['admin']), upload.single('image'), async(req, res) => {
    if (!req.body.title || !req.body.description || !req.body.releaseDate || !req.body.band) {
        console.log("Invalid body parameters");
        return res.status(400).send({
            message: "Invalid body parameters"
        })
    }

    try {
        const band = await Band.findOne({
            name: req.body.band
        });
        
        if (!band) {
            console.log("Could not find band " + req.body.band);
            return res.status(400).send({
                message: "Could not find band " + req.body.band
            })
        }
        const album = new Album({
            title: req.body.title,
            image: req.file ? path + '/' + req.file.filename : '',
            description: req.body.description,
            releaseDate: req.body.releaseDate,
            band: band
        });

        await album.save();

        res.send(album);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
})

router.put('/:id', validUser(['admin']), upload.single('image'), async (req, res) => {
    if (!req.body.title || !req.body.description || !req.body.releaseDate) {
        console.log("Invalid body parameters");
        return res.status(400).send({
            message: "Invalid body parameters"
        })
    }

    try {
        const album = await Album.findOne({
            _id: req.params.id              
        });
        

        if (!album) {
            console.log('Could not find album with id ' + req.params.id);
            return res.status(400).send({
                message: "Could not find album with id " + req.params.id
            });
        }

        const band = req.body.band ? await Band.findOne({
            name: req.body.band
        }) : album.band;
        
        if (!band) {
            console.log("Could not find band " + req.body.band);
            return res.status(400).send({
                message: "Could not find band " + req.body.band
            })
        }

        album.title = req.body.title,
        album.image = req.file ? path + '/' + req.file.filename : album.image,
        album.description = req.body.description,
        album.releaseDate = req.body.releaseDate
        album.band = band 

        await album.save();

        console.log('Edited album ' + album._id);
    
        res.send(album);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.delete('/:id', validUser(['admin']), async (req, res) => {
    try {
        const album = await Album.findOne({
            _id: req.params.id                
        });

        if (!album) {
            console.log("Could not find album with id " + req.params.id)
            return res.status(400).send({
                message: "Could not find album with id " + req.params.id
            });
        }

        //Admins can do hard deletes. Other wise just mark it as deleted
        if (req.query.hard === 'true') {
            await album.delete();
            console.log('Hard deleted album ' + album._id);
        } else {
            album.isDeleted = true;
            await album.save();
            console.log('Deleted album ' + album._id);            
        }

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

module.exports = {
    routes: router,
    model: Album
}