const express = require('express');
const { check, validationResult } = require('express-validator');
const authController = require('../controllers/auth');

const router = express.Router();

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
    '/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ],
    authController.register
);

module.exports = router;
