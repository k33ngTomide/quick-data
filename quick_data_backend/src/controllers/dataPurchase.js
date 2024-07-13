const DataPurchase = require('../models/DataPurchase');
const { snappyDataEndpoint } = require('../services/dataServices');
const User = require('../models/User');

exports.purchaseData = async (req, res) => {
    const { network, dataType, phoneNumber, status, reference } = req.body;

    try {
        const newPurchase = new DataPurchase({
            user: req.user.id,
            phoneNumber,
            network,
            dataType,
            status: status == true ? 'Success': 'Failed',
            reference: `${Date.now()}-WPY`
        });
        const purchase = await newPurchase.save();
        res.json(purchase);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id
        ).select('-password');
        res.json(user);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

exports.getDataPurchases = async (req, res) => {
    try {
        const purchases = await DataPurchase.find({ user: req.user.id }).sort({ date: -1 });
        res.json(purchases);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getAllDataPurchases = async (req, res) => {
    try {
        const purchases = await DataPurchase.find().sort({ date: -1 }).populate('user', ['name', 'email']);
        res.json(purchases);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
