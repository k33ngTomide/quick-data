const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/auth');
const dataPurchaseController = require('../controllers/dataPurchase');

const router = express.Router();

// @route   POST api/data/purchase
// @desc    Purchase data
// @access  Private
router.post(
    '/purchase',
    [
        auth,
        [
            check('network', 'Network must be provided').not().isEmpty(),
            check('phoneNumber', 'Phone number is required').not().isEmpty(),
            check('dataType', 'data type is required').not().isEmpty(),
            check('planId', 'plan id is required').not().isEmpty(),
            check('reference', 'reference is required').not().isEmpty(),
            check('status', 'status is required').not().isEmpty(),
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: errors.message });
        }
        dataPurchaseController.purchaseData(req, res);
    }
);

router.get('/getUser', auth, dataPurchaseController.getUser);

// @route   GET api/data/purchases
// @desc    Get all data purchases for logged in user
// @access  Private
router.get('/purchases', auth, dataPurchaseController.getDataPurchases);

// @route   GET api/data/admin/purchases
// @desc    Get all data purchases (admin only)
// @access  Admin
router.get('/admin/purchases', auth, isAdmin, dataPurchaseController.getAllDataPurchases);

module.exports = router;
