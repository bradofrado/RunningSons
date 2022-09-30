const express = require('express');
const mongoose = require('mongoose');
const uploader = require('./uploader.js');

const router = express.Router();
const path = '/images/songs';

const env = require('./env.js');
const Album = require('./albums.js').model;

const upload = uploader.upload(path).single('image');

const songSchema = new mongoose.Schema({
    title: String,
    album: {
        type: mongoose.Schema.ObjectId,
        ref: 'Album'
    },
    order: Number,
    description: String,
    image: String,
    weight: {
        type: Number,
        default: 0
    },
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
        
        if (album && album.exists()) {
            this.album = album;
        } else {
            this.album = null;
        }
    } 
}

songSchema.methods.toJSON = function() {
    var obj = this.toObject();

    const album = obj.album;
    const band = obj.album.band;
    
    if (album && album.title) {
        obj.albumCover = album.image;
        obj.album = album.title;
    }

    if (band && band.name) {
        obj.band = band.name;
    }

    if (!obj.image) {
        obj.image = obj.albumCover;
    }

    return obj;
}

songSchema.pre(/^find/, function() {
    this.where({isDeleted: false}).sort({order: 1});;
});

songSchema.post(/^find/, async function(docs, next) {
    let items = docs;
    const isArray = Array.isArray(docs);
    if (!isArray) {
        items = [docs];
    }

    for (let i = items.length - 1; i >= 0; i--) {
        let item = items[i];
        item && await item.populate();

        if (item && !item.album) {
            items.splice(i, 1);
        }
    }

    if (!isArray && items.length == 0) {
        docs = null;
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

router.get('/featured', async (req, res) => {
    try {
        let songs = await Song.find();

        let items = songs.slice().sort((a, b) => b.weight - a.weight).slice(0,3);

        res.send(items);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

router.post('/', validUser(['admin']), upload, async(req, res) => {
    if (!req.body.title || !req.body.description || !req.body.album) {
        if (req.file) {
            uploader.delete(path + '/' + req.file.filename);
        }
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

        let aggregate = await Song.aggregate().group({ _id: null, order: { $max: '$order' } });
        const order = aggregate[0].order + 1;

        const song = new Song({
            title: req.body.title,
            image: req.file ? path + '/' + req.file.filename : '',
            description: req.body.description,
            album: album,
            order: order
        });

        await song.save();

        res.send(song);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.put('/order', validUser(['admin']), async (req, res) => {
    try {
        if (!req.body.items || !Array.isArray(req.body.items)) {
            console.log("Invalid body parameters");
            return res.status(400).send({
                message: "Invalid body parameters"
            })
        }

        const items = req.body.items;
        const toUpdate = [];

        //Loop twice. Once to error check, another to do the saving
        for (let i = 0; i < items.length; i++) {
            const id = items[i]._id;
            const order = items[i].order;
            const item = await Song.findOne({
                _id: id
            });

            if (!item) {
                console.log("Could not find song " + id);
                return res.status(400).send({
                    message: "Could not find song " + id
                })
            }

            toUpdate.push({item: item, order: order});
        }

        for (let i = 0; i < toUpdate.length; i++) {
            const item = toUpdate[i].item;
            const order = toUpdate[i].order;

            item.order = order;
            await item.save();
        }

        return res.send(toUpdate.map(x => x.item));

    } catch(error) {
        console.log(error);
    }
})

router.put('/:id', validUser(['admin']), upload, async (req, res) => {
    if (!req.body.title || !req.body.description || !req.body.album) {
        if (req.file) {
            uploader.delete(path + '/' + req.file.filename);
        }
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

        const oldImage = song.image;

        song.title = req.body.title,
        song.image = req.file ? path + '/' + req.file.filename : song.image,
        song.description = req.body.description,
        song.album = album;

        if (song.image != oldImage) {
            uploader.delete(oldImage);
        }

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
            uploader.delete(song.image);
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