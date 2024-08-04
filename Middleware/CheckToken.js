const jwt = require('jsonwebtoken');
require('dotenv').config();
const Users = require('../Models/UsersModel');

exports.checkToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if(!refreshToken)
        {
            return res.status(401).json({
                message: "Not Authorised, No Token Provided"
            })
        }
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Not Authorised, Invalid Authorization Header"
            })
        }
        const token = authHeader.split(' ')[1];
        if (token) {
            const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const refreshPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

            // check token and refresh token belongs to same user
            if(payload.user._id===refreshPayload.user._id)
            {
                req.user = await Users.findOne({ _id: payload.user._id }).select('-password');
                next();
            }
            else{
                res.status(403).json({
                    message: "Token invalid"
                })
            }
        }
        else {
            return res.status(401).json({
                message: "Not Authorised, No Token Provided"
            })
        }
    }
    catch (error) {
        return res.status(403).json({
            message: "Not Authorised, Token Failed",
            ERROR: error.message
        })
    }
}