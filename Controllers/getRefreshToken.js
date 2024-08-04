const jwt = require('jsonwebtoken');
require('dotenv').config();
const users = require('../Models/UsersModel');
const CreateJWT = require('../utils/CreateJWT');

exports.getRefreshToken = async (req, res) => {
    try {

        const {email} = req.body;

        // check for refresh token in req.cookies
        const Token = req.cookies?.refreshToken;

        // clear cookie otherwie it will append cookie with new cookie
        // res.clearCookie("refreshToken",{httpOnly:true});

        // if no token in cookies send 401 unauthorised
        if (!Token) {
            throw 401;
        }

        // find user in DB with this refresh token present in req.cookies
        const userFound = await users.findOne({ refreshToken: Token });

        // verify token and extract payload object which has user to whom token belongs
        const payload = jwt.verify(Token, process.env.REFRESH_TOKEN_SECRET);

        // if no user found then token is reused and it was deleted earlier and user is hacked, delete all refresh token of hacked user and send 403 forbidden 
        //- (REUSE OF TOKEN)
        // or
        // check token in req.cookies really belongs to the user or not otherwise throw forbidden and clear array of token of both user
        if ( !userFound || (payload.user.email !== email) ) {

            const hackedUser = await users.findOne({ email: payload.user.email });
            hackedUser.refreshToken = [];
            await hackedUser.save();
            
            const currentUser = await users.findOne({ email });

            // check current user and token related user are different, if same we had already cleared array of token
            if(currentUser.email !== hackedUser.email)
            {
                currentUser.refreshToken = [];
                await currentUser.save();
            }
           
            throw 403;
        }

        // check if user found is same as user from whom request is processed, if not matched send 403 token invalid (forbidden)
        if ((userFound.email === email)) {

            // create new tokens
            const newRefreshToken = CreateJWT.createRefreshJWT({email:userFound.email,_id:userFound._id,name:userFound.name});
            const accessToken = CreateJWT.createJWT({email:userFound.email,_id:userFound._id,name:userFound.name});

            // create a new refresh token array and add new token created above but not add req.cookies token in array as it is now been used to grant new access token

            // filter req.cookies token from array so that it will not be included in new refresh token array
            const newRefreshTokenArray = userFound.refreshToken.filter(t => t !== Token);

            // create new array and add new refresh token created just now and save user found
            userFound.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            await userFound.save();

            // send new refresh token created above in res.cookies 
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            });

            const { _id, name, email } = userFound;
            const user = { _id, name, email };

            return res.status(200).json({
                message: "new access token granted",
                user,
                cartList: userFound.cartList,
                total: userFound.total,
                accessToken,
                orders: userFound.orders
            })
        }
    } catch (error) {
        if (error === 401) {
            return res.status(401).json({
                message: "No token provided",
            })
        }
        else {
            return res.status(403).json({
                message: "forbidden"
            })
        }
    }
}