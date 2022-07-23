const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const router = express.Router();
const path = '/images/songs';

const env = require('./env.js');
const Album = require('./albums.js').model;

const upload = multer({
    dest: env.root+path,
    limits: {
        fileSize: 50000000
    }
});

const songSchema = new mongoose.Schema({
    title: String,
    album: {
        type: mongoose.Schema.ObjectId,
        ref: 'Album'
    },
    description: String,
    image: String,
    isDeleted: {
        type: Boolean,
        default: false
    }
});

songSchema.methods.populate = async function() {
    if (mongoose.isValidObjectId(this.album)) {
        const album = await Album.findOne({
            _id: this.album
        });

        if (album) {
            this.album = album;
        }
    } 
}

songSchema.methods.toJSON = function() {
    var obj = this.toObject();

    const album = obj.album;
    const band = obj.album.band;
    
    if (album.title) {
        obj.albumCover = album.image;
        obj.album = album.title;
    }

    if (band.name) {
        obj.band = band.name;
    }

    if (!obj.image) {
        obj.image = obj.albumCover;
    }

    return obj;
}

songSchema.pre(/^find/, function() {
    this.where({isDeleted: false});
});

songSchema.post(/^find/, async function(docs, next) {
    let items = docs;
    if (!Array.isArray(docs)) {
        items = [docs];
    }

    for (let item of items) {
        await item.populate();
    }

    next();
});

const Song = mongoose.model('Song', songSchema);

const users = require('./users.js');
const validUser = users.valid;

router.get('/', async (req, res) => {
    try {
        let songs;
        const {song, album} = req.query;
        if (song) {
            songs = await Song.find({
                title: song
            });
        } else {
            songs = await Song.find();
        }

        if (album) {
            songs = songs.filter(x => x.album.title == album);
        }
        

        res.send(songs);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post('/', validUser(['admin']), upload.single('image'), async(req, res) => {
    if (!req.body.title || !req.body.description || !req.body.album) {
        console.log("Invalid body parameters");
        return res.status(400).send({
            message: "Invalid body parameters"
        })
    }

    try {
        const album = await Album.findOne({
            name: req.body.album
        });
        
        if (!album) {
            console.log("Could not find album " + req.body.album);
            return res.status(400).send({
                message: "Could not find album " + req.body.album
            })
        }

        const song = new Song({
            title: req.body.title,
            image: req.file ? path + '/' + req.file.filename : '',
            description: req.body.description,
            album: album
        });

        await song.save();

        res.send(song);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
})

router.put('/:id', validUser(['admin']), upload.single('image'), async (req, res) => {
    if (!req.body.title || !req.body.description || !req.body.album) {
        console.log("Invalid body parameters");
        return res.status(400).send({
            message: "Invalid body parameters"
        })
    }

    try {
        const song = await Song.findOne({
            _id: req.params.id              
        });   
        

        if (!song) {
            console.log('Could not find song with id ' + req.params.id);
            return res.status(400).send({
                message: "Could not find song with id " + req.params.id
            });
        }

        const album = req.body.album ? await Album.findOne({
            title: req.body.album
        }) : song.album;
        
        if (!album) {
            console.log("Could not find album " + req.body.album);
            return res.status(400).send({
                message: "Could not find album " + req.body.album
            })
        }

        song.title = req.body.title,
        song.image = req.file ? path + '/' + req.file.filename : song.image,
        song.description = req.body.description,
        song.album = album;

        await song.save();

        console.log('Edited song ' + song._id);
    
        res.send(song);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.delete('/:id', validUser(['admin']), async (req, res) => {
    try {
        const song = await Song.findOne({
            _id: req.params.id                
        });

        if (!song) {
            console.log("Could not find song with id " + req.params.id)
            return res.status(400).send({
                message: "Could not find song with id " + req.params.id
            });
        }

        //Admins can do hard deletes. Other wise just mark it as deleted
        if (req.query.hard === 'true') {
            await song.delete();
            console.log('Hard deleted song ' + song._id);
        } else {
            song.isDeleted = true;
            await song.save();
            console.log('Deleted song ' + song._id);            
        }

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

module.exports = {
    routes: router,
    model: Song
}