const express = require('express');
const mongoose = require('mongoose');
const argon2 = require('argon2');

const router = express.Router();
  

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    firstname: String,
    lastname: String,
    clientSecret: String,
    codes: [{
        code: { type:
            mongoose.Schema.ObjectId,
            ref: 'CouponCode'
        },
        isApplied: {
            type: Boolean,
            default: false
        },
        dateApplied: Date
    }],
    roles: [{
        type: String,
        default: ""
    }]
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password'))
        return next();

    try {
        const hash = await argon2.hash(this.password);
        this.password = hash;
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
});

userSchema.methods.comparePassword = async function(password) {
    try {
        const isMatch = await argon2.verify(this.password, password);
        return isMatch;
    } catch(error) {
        return false;
    }
}

userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

userSchema.methods.hasRoles = function(roles) {
    return roles.every(role => this.roles.includes(role));
}

userSchema.methods.codeApplied = async function(Code, code) {
    let foundCode = await Code.findOne({
        code: code
    });

    if (foundCode) {
        const codes = this.codes.filter(x => x.code.toString() === foundCode._id.toString());

        return codes.length;
    }

    return 0;
}

//isApplied: fetch the codes that have the same isApplied specified (or all of them if null)
userSchema.methods.getCodes = async function(Code, isApplied = null) {
    const codes = [];
    for (let i = this.codes.length - 1; i >=0; i--) {
        let code = this.codes[i];
        const populated = await Code.findOne({
            _id: code.code
        });

        //Only get the codes that exist (some 'don't exist' because they have expired)
        if (!populated) {
            this.codes.splice(i, 1);
            continue;
        }

        if (isApplied == null || code.isApplied === isApplied) {
            code.code = populated;
            codes.push(code);
        }
    }

    return codes;
}

userSchema.methods.removeCode = async function(id) {
    const index = this.codes.findIndex(x => x._id.toString() == id.toString());
    if (index > -1) {
        this.codes.splice(index, 1);   
    }
    
    await this.save();
}

const User = mongoose.model('User', userSchema);

const activeUsers = [];

/* Middleware */
const validUserRoles = async (req, res, next, roles) => {
    if (!req.session.userID)
    {
        return res.status(403).send({
            message: "not logged in"
        });
    }
    
    try {
        let user = await User.findOne({
            _id: req.session.userID 
        });

        if (!user) {
            return res.status(403).send({
                message: "not logged in"
            });
        }

        if (roles && user.roles) {
            for (let i = 0; i < roles.length; i++) {
                const role = roles[i];
                if (user && !user.roles.includes(role)) {
                    return res.status(403).send({
                        message: "Must have role " + role + " to perform this feature"
                    });
                }
            }
        }
        

        req.user = user;
    } catch (error) {
        return res.status(403).send({
            message: "not logged in"
        });
    }

    next();
}

const validUser = function(roles) {
    //valid user used normally without roles (req, res, next  as arguments)
    if (arguments.length === 3) {
        return validUserRoles.apply(this, arguments);
    }

    //Called with roles
    return function() {
        arguments[arguments.length] = roles;
        arguments.length += 1;
        return validUserRoles.apply(this, arguments);
    }
}

const getRoles = async function(roles) {
    const users = await User.find();

    return users.filter(x => x.hasRoles(roles));
}

const newGuest = async function() {
    const user = new User({

    });
    user.firstname = `Guest${user._id}`;
    user.username = user.firstname;
    user.roles = ['guest'];

    await user.save();

    return user;
}

/* Endpoints */

router.post('/', async (req, res) => {
    if (!req.body.username || !req.body.password || !req.body.email) {
        return res.status(400).send({
            message: "Username, password, and email are required"
        });
    }

    try {
        req.body.username = req.body.username.toLowerCase();

        const existingUser = await User.findOne({
            username: req.body.username
        });
        if (existingUser) {
            console.log('Username already exists: ' + req.body.username);
            return res.status(403).send({
                message: "Username already exists"
            });
        }

        if (req.body.role) {
            console.log('Tried to specify role: ' + req.body.username);
            return res.status(403).send({
                message: "Must be admin to specify role"
            })
        }

        const user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });
        await user.save();

        req.session.userID = user._id;

        console.log('Created user: '+user.username, user._id);

        return res.send({
            user: user
        });
    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// login a user
router.post('/login', async (req, res) => {
    // Make sure that the form coming from the browser includes a username and a
    // password, otherwise return an error.
    if (!req.body.username || !req.body.password)
      return res.status(400).send({
          message: "Must include username and password"
      });
  
    try {
        //  lookup user record
        const user = await User.findOne({
            username: req.body.username.toLowerCase()
        });

        // Return an error if user does not exist.
        if (!user) {
            console.log('Failed login: ' + req.body.username);

            return res.status(403).send({
                message: "Username or password is incorrect"
            });
        }
  
        // Return the SAME error if the password is wrong. This ensure we don't
        // leak any information about which users exist.
        if (!await user.comparePassword(req.body.password)) {
            console.log('Failed login: ' + req.body.username);

            return res.status(403).send({
                message: "Username or password is incorrect"
            });
        }

        //set user session info
        req.session.userID = user._id;

        console.log('User logged in: ' + user.username, user._id);
  
      return res.send({
        user: user
      });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});

// get logged in user
router.get('/', validUser, async (req, res) => {
    try {
        //Don't send back any guest users
        if (req.user.hasRoles(['guest'])) {
            return res.status(403).send({
                message: "Not logged in"
            });
        }

        res.send({
            user: req.user
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// logout
router.delete("/", validUser, async (req, res) => {
    try {
        console.log('User logged out: ' + req.user.username, req.user._id)
        req.session = null;
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});


module.exports = {
    routes: router,
    model: User,
    valid: validUser,
    getRoles: getRoles,
    newGuest: newGuest
}