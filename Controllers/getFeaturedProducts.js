const featuredProductsData = require('../Models/FeaturedProductsModel');

exports.getFeaturedProducts = (req,res) => {
    featuredProductsData.find()
    .then((result)=>{
        res.status(200).json({
            message:"featured products fetched",
            DATA:result
        })
    })
    .catch(err => {
        res.status(500).json({
            message:"data not fetched",
            ERROR:err
        })
    })
}