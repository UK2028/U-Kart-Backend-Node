const users = require('../Models/UsersModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const CreateJWT = require('../utils/CreateJWT');

exports.loginUser = async (req, res) => {
    try {

        // check for token in cookie if present then clear cookie
        const token = req.cookies?.refreshToken;
        if(token)
        {
            res.clearCookie("refreshToken",{ httpOnly: true });
            
            const userWithTokenFound = await users.findOne({ refreshToken: token });

            // if nothing found with the token then REUSE detection (means token is not in refresh token array and token is not expired, if token is expired then next "if" statement will clear token array since expired token was present in array)
            if(!userWithTokenFound)
            {
                jwt.verify(token,process.env.REFRESH_TOKEN_SECRET,async (err,payload)=>{
                    if(payload)
                    {
                        const hackedUser = await users.findOne({email:payload.user.email});
                        hackedUser.refreshToken = [];
                        await hackedUser.save();
                    }
                });
            }

            // if user found from token means user hasn't logged out or hasn't used refreshToken to grant any access token and token is present in array or it is stolen and it is now in req.cookie and someone else is trying to log in
            if(userWithTokenFound)
            {
                userWithTokenFound.refreshToken = [];
                await userWithTokenFound.save();
            }
        }

        // check for email and password
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "please fill email"
            })
        }
        if (!password) {
            return res.status(400).json({
                message: "please fill password"
            })
        }

        // check for user in DB
        const userFound = await users.findOne({ email });
        if (userFound) {
            
            // check for password  
            const passwordCompare = await bcrypt.compare(password, userFound.password);
            if (passwordCompare) {

                // create new token if all is good
                const createUser = {
                    _id: userFound._id,
                    name: userFound.name,
                    email: userFound.email
                }
                const newRefreshToken = CreateJWT.createRefreshJWT(createUser);
                const accessToken = CreateJWT.createJWT(createUser);

                // set refresh token in cookie
                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000
                });

                // const user = await users.findOneAndUpdate({email: userFound.email},{$push:{refreshToken:newRefreshToken}},{new: true}).select('-password -refreshToken');
                // return res.status(200).json({
                //     message: "user logged in successfully",
                //     user,
                //     accessToken
                // })
                
                //or

                // update user refreshToken Array in DB by adding new Refresh token and without adding req.cookie(if any present) and save the user found
                const newRefreshTokenArray = token ? userFound.refreshToken.filter(t => t!==token ) : userFound.refreshToken;
                
                userFound.refreshToken = [ ...newRefreshTokenArray, newRefreshToken ];
                await userFound.save();
                const { _id, name, email } = userFound;
                const user = { _id, name, email };

                // send response with access token created above 
                return res.status(200).json({
                    message: "user logged in successfully",
                    user,
                    cartList: userFound.cartList,
                    total: userFound.total,
                    accessToken,
                    orders: userFound.orders 
                })
            }
            else {

                // password incorrect send 401 unauthorised
                return res.status(401).json({
                    message: "incorrect password"
                })
            }
        }
        else {

            // no user found in DB for email in req.body, send 401 unauthorised
            return res.status(401).json({
                message: "No user found"
            })
        }
    } catch (error) {
        console.log(error);
    }
}