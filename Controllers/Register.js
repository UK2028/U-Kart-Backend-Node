const users = require('../Models/UsersModel');
const bcrypt = require('bcrypt');

exports.registerUser = async (req,res) => {
    try
    {
        const { name, email, password } = req.body;
        if(!name)
        {
            return res.status(400).json({
                message: "please fill name"
            })
        }
        if(!email)
        {
            return res.status(400).json({
                message: "please fill email"
            })
        }
        if(!password)
        {
            return res.status(400).json({
                message: "please fill password"
            })
        }
        const userAlreadyRegister = await users.findOne({ email });
        const hashedPassword = await bcrypt.hash(password,10);
        if(userAlreadyRegister)
        {
            return res.status(409).json({message:"user already registered"});
        }
        const user = await users.create({ name, email, password:hashedPassword, total:0, cartList: [], orders: [] });
        res.status(201).json({
            message: "user created successfully",
            name: user.name,
            email: user.email
        })
    } catch(error)
    {
        console.log(error);
    }
}