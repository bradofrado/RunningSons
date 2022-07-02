const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const musicSchema = new mongoose.Schema({
    title: String
});

const Music = mongoose.model('Music', musicSchema);

const users = require('./users.js');
const validUser = users.valid;

router.get('/', async (req, res) => {
    try {
        const music = await Music.find();

        res.send(music);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post('/', validUser(['Admin']), async(req, res) => {
    try {
        const music = new Music({
            title: req.body.title
        });

        await music.save();

        res.send(music);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
})

router.put('/:id', validUser(['Admin']), async (req, res) => {
    try {
        if (!req.body.title) {
            return res.status(400).send({
                message: "Title is required"
            });
        }

        const music = await Music.findOne({
            _id: req.params.id              
        });   
        

        if (!music) {
            console.log('Could not find music with id ');
            return res.status(400).send({
                message: "Could not find music with id "
            });
        }

        await music.save();

        console.log('Edited music ' + music._id);
    
        res.send(music);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.delete('/:id', validUser(['Admin']), async (req, res) => {
    try {
        const isAdmin = req.user.roles.includes('Admin');

        const music = await Music.findOne({
            _id: req.params.id                
        });

        if (!music) {
            console.log("Could not find music with id " + req.params.id)
            return res.status(400).send({
                message: "Could not find music with id " + req.params.id
            });
        }

        //Admins can do hard deletes. Other wise just mark it as deleted
        if (req.query.hard === 'true') {
            if (isAdmin) {
                await music.delete();
                console.log('Hard deleted music ' + music._id);            
            } else {
                console.log("Only admins can do a hard delete for bookings");
                return res.status(400).send({
                    message: "Only admins can do a hard delete"
                });
            }
        } else {
            music.isDeleted = true;
            await music.save();
            console.log('Deleted music ' + music._id);            
        }

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

module.exports = {
    routes: router,
    model: Music
}