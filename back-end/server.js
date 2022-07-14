const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

const env = require('./env.js');
const mongoConnection = env.mongoConnection;
const port = env.port;

//connect to the database
mongoose.connect(mongoConnection, {
    useNewUrlParser: true
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
    name: 'session',
    keys: ['secretValue'],
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

const music = require('./music.js');
const users = require('./users.js');
const merchandiseType = require('./merchandise-types.js');
const merchandise = require('./merchandise.js');
const payments = require('./payment.js');
const cart = require('./cart.js');

app.use('/api/music', music.routes);
app.use('/api/users', users.routes);
app.use('/api/merchandise', merchandise.routes);
app.use('/api/types', merchandiseType.routes);
app.use('/api/payments', payments.routes);
app.use('/api/cart', cart.routes);

app.listen(port, () => console.log(`Server listening on port ${port}!`));