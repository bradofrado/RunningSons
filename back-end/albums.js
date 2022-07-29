const express = require('express');
const mongoose = require('mongoose');
const uploader = require('./uploader.js');

const router = express.Router();
const path = '/images/albums';

const Band = require('./bands.js').model;

const upload = uploader.upload(path).single('image');

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

        this.band = band;
    } 
}

albumSchema.methods.toJSON = function() {
    var obj = this.toObject();

    if (obj.band && obj.band.name) {
        obj.band = obj.band.name;
    }

    return obj;
}

albumSchema.methods.exists = function() {
    return !this.isDeleted && !!this.band;
}

//Filter out the deleted albums
albumSchema.pre(/^find/, function() {
    this.where({isDeleted: false});
});

//Populate the albums 
albumSchema.post(/^find/, async function(docs, next) {
    let items = docs;
    const isArray = Array.isArray(docs);
    if (!isArray) {
        items = [docs];
    }

    for (let i = items.length - 1; i >= 0; i--) {
        let item = items[i];
        item && await item.populate();
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

router.post('/', validUser(['admin']), upload, async(req, res) => {
    if (!req.body.title || !req.body.description || !req.body.releaseDate || !req.body.band) {
        if (req.file) {
            uploader.delete(path + '/' + req.file.filename);
        }
        console.log("Invalid body parameters");
        return res.status(400).send({
            message: "Invalid body parameters"
        })
    }

    if (!Date.parse(req.body.releaseDate)) {
        if (req.file) {
            uploader.delete(path + '/' + req.file.filename);
        }
        console.log("Invalid date " + req.body.releaseDate);
        return res.status(400).send({
            message: "Invalid date " + req.body.releaseDate
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

router.put('/:id', validUser(['admin']), upload, async (req, res) => {
    if (!req.body.title || !req.body.description || !req.body.releaseDate) {
        if (req.file) {
            uploader.delete(path + '/' + req.file.filename);
        }
        console.log("Invalid body parameters");
        return res.status(400).send({
            message: "Invalid body parameters"
        })
    }

    if (!Date.parse(req.body.releaseDate)) {
        if (req.file) {
            uploader.delete(path + '/' + req.file.filename);
        }
        console.log("Invalid date " + req.body.releaseDate);
        return res.status(400).send({
            message: "Invalid date " + req.body.releaseDate
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

        const oldImage = album.image;

        album.title = req.body.title,
        album.image = req.file ? path + '/' + req.file.filename : album.image,
        album.description = req.body.description,
        album.releaseDate = req.body.releaseDate
        album.band = band 

        if (album.image != oldImage) {
            uploader.delete(oldImage);
        }

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
            uploader.delete(album.image);
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