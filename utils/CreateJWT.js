const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.createJWT = (user) => {
    const token = jwt.sign({user},process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '60m' });
    return token;
}

exports.createRefreshJWT = (user) => {
    const token = jwt.sign({user},process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '1d' });
    return token;
}