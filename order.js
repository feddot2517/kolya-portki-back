const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    message: {
        type: String,
        required: false,
    },
    date: {
        type: Date,
        required: false,
    }
});

module.exports = {Order: mongoose.model('Order', orderSchema, 'orders')};
