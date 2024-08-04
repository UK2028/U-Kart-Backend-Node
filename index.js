require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");

const slashRouter = require('./Routers/slashRouter');

const PORT = process.env.PORT || 9091;
const URI = process.env.MONGO_URI;

const app = express();

app.use(cors({origin: true, credentials: true})); // allow credentials(cookie) and origin(from where to send)
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', slashRouter);

const connectToMongo = async () => {
    try{
        const conn = await mongoose.connect(URI);
        console.log(`Mongo connected: ${conn.connection.host}`);
    }
    catch(err){
        console.log("err:",err.reason);
    }
}

connectToMongo();

app.listen(PORT, (err)=>{
    if(err)
    {
        console.log("Server err:",err);
    }
    console.log("server started listening at port:",PORT);
});
