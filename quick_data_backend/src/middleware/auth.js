const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports.isAdmin = async function (req, res, next) {
    try {
        const user = await User.findById(req.user.id);
        
        if (user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied' });
        }

        next();
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
