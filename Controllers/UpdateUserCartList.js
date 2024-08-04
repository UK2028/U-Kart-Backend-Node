const Users = require('../Models/UsersModel');

exports.addToUserCartList =  async (req,res) => {

    const { product } = req.body;
    if(!product)
    {
        return res.status(404).json({
            message: "Product not provided"
        })
    }

    const userFound = await Users.findOne({ _id: req.user._id });
    
    if(userFound)
    {
        userFound.cartList = [ ...userFound.cartList, product ];
        userFound.total += product.price;
        await userFound.save();
        return res.status(200).json({
            message: "cartList updated",
            user:{
                _id: userFound._id,
                email: userFound.email,
                name: userFound.name
            },
            cartList: userFound.cartList,
            total: userFound.total,
            orders: userFound.orders
        })
    }
    else
    {
        return res.status(401).json({
            message: "User not found"
        })
    }

}

exports.removeFromUserCartList =  async (req,res) => {

    const { product } = req.body;
    if(!product)
    {
        return res.status(404).json({
            message: "Product not provided"
        })
    }

    const userFound = await Users.findOne({ _id: req.user._id });

    if(userFound)
    {
        userFound.cartList = userFound.cartList.filter(item => item.id !== product.id);
        userFound.total -= product.price;
        await userFound.save();
        return res.status(200).json({
            message: "cartList updated",
            user:{
                _id: userFound._id,
                email: userFound.email,
                name: userFound.name
            },
            cartList: userFound.cartList,
            total: userFound.total,
            orders: userFound.orders
        })
    }
    else
    {
        return res.status(401).json({
            message: "User not found"
        })
    }
    
}