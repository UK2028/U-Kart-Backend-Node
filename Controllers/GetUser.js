const Users = require('../Models/UsersModel');

exports.getUser = async (req, res) => {
    const user = await Users.findOne({ _id: req.user._id }).select('-password -refreshToken');
    if (user) {
        res.status(200).json({
            message: "User Found",
            user: { _id: user._id, email: user.email, name: user.name },
            cartList: user.cartList,
            total: user.total,
            orders: user.orders
        })
    }
    else {
        res.status(401).json({
            message: "No User Found"
        })
    }
}