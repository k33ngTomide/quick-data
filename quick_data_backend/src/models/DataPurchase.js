const mongoose = require('mongoose');

const DataPurchaseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    network: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    dataType: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    reference: {
        type: String,
        required: true
    },
    dataType: {
        type: String,
        default: 'SME'
    },
    status: {
        type: String,
        default: 'Pending'
    }
});

module.exports = mongoose.model('DataPurchase', DataPurchaseSchema);
