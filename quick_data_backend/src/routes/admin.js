const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const adminController = require('../controllers/admin');
const { isAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET api/admin/users
// @desc    Get all registered users
// @access  Admin
router.get('/users', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/admin/users/:id
// @desc    Delete a user
// @access  Admin
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
    try {
        await User.findByIdAndRemove(req.params.id);
        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;


// @route   POST api/admin/register
// @desc    Register an admin user
// @access  Admin
router.post(
    '/register',
    [
        auth,
        isAdmin,
        [
            check('name', 'Name is required').not().isEmpty(),
            check('email', 'Please include a valid email').isEmail(),
            check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
        ]
    ],
    adminController.registerAdmin
);



module.exports = router;
