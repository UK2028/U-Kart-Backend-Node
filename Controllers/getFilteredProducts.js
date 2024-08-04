const productsData = require('../Models/ProductsModel');

exports.getFilteredProducts = (req,res) => {
    let filterObject = {}
    if(req.body.rating)
    {
        filterObject.rating={
            $gte:req.body.rating
        }
    }
    if(req.body.in_stock)
    {
        filterObject.in_stock=req.body.in_stock
    }
    if(req.body.best_seller)
    {
        filterObject.best_seller=req.body.best_seller
    }
    let sortObject = {};
    if(req.body.sort)
    {
        sortObject = { price:req.body.sort }
    }
    productsData.find(filterObject).sort(sortObject)
    .then(result => {
        res.status(200).json({
            message:'Filtered Products Fetched',
            Len:result.length,
            DATA:result
        })
    })
    .catch(err=>{
        res.status(500).json({
            message:'Filtered Products are not Fetched',
            ERROR:err
        })
    })
}