const productsData = require('../Models/ProductsModel');

exports.getProducts = (req,res) => {
    if(req.query.name)
    {
        req.query.name = req.query.name.trim();
    }
    const productName = new RegExp(req.query.name,"i");
    productsData.find({name:{$in:[productName]}})
    .then(result => {
        res.status(200).json({
            message:"Products with query fetched",
            DATA:result
        })
    })
    .catch(err => {
        res.status(500).json({
            message:"Products with query are not fetched successfully",
            ERROR:err
        })
    })
}