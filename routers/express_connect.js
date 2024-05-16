const express = require('express');
const session = require('express-session');
const PgSimple = require('connect-pg-simple')(session);
const router = express.Router();
const validator = require('validator');
const bcrypt = require('bcrypt');
const passport = require('passport');
const initializePassport = require('../passportConfig');
const isUserAuthenticated = require('./isUserAuthenticated');
const {Users} = require('../models');
const postsRouter = require('./posts');
const commentsRouter = require('./comments');
require('dotenv').config();

const sessionStore = new PgSimple({
    conString: `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`,
    tableName: 'session',
});

router.use(session ({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365,
    },
}));

initializePassport(passport);
router.use(express.json());
router.use(express.urlencoded({extended: true}));
router.use(passport.initialize());
router.use(passport.session());

router.post('/register', async (req, res) => {
    try {
        let { username, email, password, password2 } = req.body;
        if (!username || !email || !password || !password2) {
            return res.status(400).json({success: false, message: 'Missing required fields'});         
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({success: false, message: 'Invalid email'});
        }
        email = validator.normalizeEmail(email);

        if (password.length < 6) {
            return res.status(400).json({success: false, message: 'Password must be 6 characters'});
        }
        if (!validator.equals(password, password2)) {
            return res.status(400).json({success: false, message: 'Passwords do not match'});
        }
        const existingUserWithUsername = await Users.findOne({
            where: {
                username,
            }
        });
        const existingUserWithEmail = await Users.findOne({
            where: {
                email,
            },
        });

        if (existingUserWithUsername) {
            return res.status(400).json({success: false, message: 'User with provided username already exists'});
        }
        if (existingUserWithEmail) {
            return res.status(400).json({success: false, message: 'User with provided email address already exists'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Users.create({
            username,
            email,
            password_hash: hashedPassword,
        });
        res.status(200).json({success: true, data: newUser}); 
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
    
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).json({ success: true, message: `You are signed in` });
});

router.get('/logout', isUserAuthenticated, (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Logout failed' });
        }
        res.status(200).json({ success: true, message: 'Logged out' });
    });
});

router.use('/posts', postsRouter);
router.use('/comments', commentsRouter);
module.exports = router;