const  dotenv  = require('dotenv')
const mongoose = require('mongoose')
const config = require('./config')
dotenv.config()
const connectDB = async() =>{
    console.log('Connecting Mongodb')
    try {
        await mongoose.connect(config.db.MongoUserURI )
        console.log('Mongodb Connected Successfully')
    } catch (error) {
        console.error(`Mongodb connection Failed ${error}`)
    }
}

module.exports = connectDB;
