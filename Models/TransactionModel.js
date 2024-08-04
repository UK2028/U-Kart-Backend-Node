const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true
    },
    payment_id: {
        type: String,
    },
    amount: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("transactions",transactionSchema);