const Users = require('../Models/UsersModel');

exports.createOrderList = async (req,res) => {
    const { userId, cartList, orderId, amount } = req.body;

    const userFound = await Users.findOne({ _id: userId }).select('-password -refreshToken');

    if(userFound)
    { 
        userFound.orders = [ ...userFound.orders, { orderId, amount: Number(amount)/100, orderArray: [...cartList] } ];
        userFound.cartList = [];
        userFound.total = 0;

        await userFound.save();

        return res.status(200).json({
            message: "orders list created",
            List: userFound.orders
        });
    }
    else
    {
        return res.status(401).json({
            message: "user not found"
        })
    }

}