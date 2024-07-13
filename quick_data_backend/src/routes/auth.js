const express = require('express');
const { check, validationResult } = require('express-validator');
const authController = require('../controllers/auth');

const router = express.Router();

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
    '/',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    authController.login
);


module.exports = router;
