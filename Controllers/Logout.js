const users = require('../Models/UsersModel');

exports.logoutUser = async (req,res) => {

    const Token = req.cookies?.refreshToken;

    res.clearCookie("refreshToken",{
        httpOnly: true
    })

    if(!Token)
    {
        return res.sendStatus(204);
    }
    
    const userFound = await users.findOne({ refreshToken: Token });

    if(!userFound){
        return res.sendStatus(204);
    }
    
    // don't save refreshToken as it has never been used to grant access token so discard it
    userFound.refreshToken = userFound.refreshToken.filter(t => t !== Token);

    await userFound.save();

    res.status(200).json({
        message: "Logout successfully"
    })
}