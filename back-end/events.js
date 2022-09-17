const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const uploader = require('./uploader.js');

const util = require('./util.js');

const env = require('./env.js');
const path = '/images/events/';

const upload = uploader.upload('/images/events').single('image');

const eventsSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    date: Date,
    location: String,
    isDeleted: {
        type: Boolean,
        default: false
    }
});


eventsSchema.pre(/^find/, function() {
    this.where({isDeleted: false});
});


const Event = mongoose.model('Event', eventsSchema);

const users = require('./users.js');
const validUser = users.valid;

router.get('/', async (req, res) => {
    try {
        const event = await Event.find();

        res.send(event);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get('/:id', async (req, res) => {
    try {
        let event = await Event.findOne({
            _id: req.params.id
        });

        if (!event) {
            console.log("Could not find event " + req.params.id);
            return res.status(400).send({
                message: "Could not find event " + req.params.id
            });
        }

        res.send(event);
    } catch(error) {
        console.log(error);
    }
});

router.post('/', validUser(['admin']), upload, async (req, res) => {
    if (!req.body.title ||  !req.body.description || !req.body.date || !req.body.location) {
        if (req.file) {
            uploader.delete(path + '/' + req.file.filename);
        }
        return res.status(400).send({
            message: "Invalid body parameters"
        });
    }
    try {
        const event = new Event({
            title: req.body.title,
            description: req.body.description,
            image: req.file ? path + req.file.filename : null,
            location: req.body.location,
            date: req.body.date,
        });

        await event.save();

        res.send(event);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.put('/:id', validUser(['admin']), upload, async (req, res) => {
    try {
        if (!req.body.title ||  !req.body.description || !req.body.date || !req.body.location) {
            if (req.file) {
                uploader.delete(path + '/' + req.file.filename);
            }
            return res.status(400).send({
                message: "Invalid body parameters"
            });
        }

        const event = await Event.findOne({
            _id: req.params.id              
        });   
        

        if (!event) {
            console.log('Could not find event with id ' + req.params.id);
            return res.status(400).send({
                message: "Could not find event with id " + req.params.id
            });
        }

        const oldImage = event.image;

        event.title = req.body.title;
        event.description = req.body.description;
        event.location = req.body.location;
        event.image = req.file ? path + req.file.filename : event.image;
        event.date = req.body.date;
        
        if (oldImage != event.image) {
            uploader.delete(oldImage);
        }

        await event.save();

        console.log('Edited event ' + event._id);
    
        res.send(event);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.delete('/:id', validUser(['admin']), async (req, res) => {
    try {
        let event = await Event.findOne({
            _id: req.params.id                
        });

        if (!event) {
            console.log("Could not find event with id " + req.params.id)
            return res.status(400).send({
                message: "Could not find event with id " + req.params.id
            });
        }

        //Admins can do hard deletes. Other wise just mark it as deleted
        if (req.query.hard === 'true') {
            uploader.delete(event.image);
            await event.delete();
            console.log('Hard deleted event ' + event._id);  
        } else {
            event.isDeleted = true;
            await event.save();
            console.log('Deleted event ' + event._id);            
        }

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

module.exports = {
    routes: router,
    model: Event
}