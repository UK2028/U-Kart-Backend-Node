const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {type: String},
    amount: {type: Number},
    orderArray:[{
        id: {
            type: Number,
            required:true
        },
        name: {
            type: String,
            required: true
        },
        overview: {
            type: String,
            required: true
        },
        long_description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        poster: {
            type: String,
            required: true
        },
        image_local: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        in_stock: {
            type: Boolean,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        best_seller: {
            type: Boolean,
            required: true
        }
    }]
});

const usersSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    refreshToken:[String],
    cartList:[{
        id: {
            type: Number,
            required:true
        },
        name: {
            type: String,
            required: true
        },
        overview: {
            type: String,
            required: true
        },
        long_description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        poster: {
            type: String,
            required: true
        },
        image_local: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        in_stock: {
            type: Boolean,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        best_seller: {
            type: Boolean,
            required: true
        }
    }],
    total:{
        type: Number,
        required: true
    },
    orders:[orderSchema]
});

module.exports = mongoose.model("users",usersSchema);