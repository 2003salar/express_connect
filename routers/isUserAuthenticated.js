const isUserAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(403).json({success: false, message: 'You are unauthorized'});
};

module.exports = isUserAuthenticated;