const mongoose = require('mongoose');

const featuredProductsSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("featured_products",featuredProductsSchema,"featured_products");