const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { Users } = require('./models');

const authenticateUser = async (username, password, done) => {
    try {
        const user = await Users.findOne({
            where: {
                username,
            },
        });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                return done(null, false);
            }
            return done(null, user);
        } 
        return done (null, null);
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'})
    }
};
const initialize = (passport) => {    
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
    }, authenticateUser));
};

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await Users.findByPk(id);
        if (user) {
            return done(null, user);
        }
        return done(null, null);
    } catch (error) {
        done(error);
    }
});

module.exports = initialize;