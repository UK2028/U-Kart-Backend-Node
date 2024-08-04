const productData = require('../Models/ProductsModel');

exports.getProductdetail = (req,res) => {
    productData.findOne({id:req.params.id})
    .then( result => {
        res.status(200).json({
            message:"Product Detail is fetched",
            DATA:result
        })
    })
    .catch( err => {
        res.status(500).json({
            message:"product detail not fetched",
            ERROR:err
        })
    })
}