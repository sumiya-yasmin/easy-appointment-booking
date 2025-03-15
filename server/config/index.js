const  dotenv  = require('dotenv')
dotenv.config()
const config = {
    PORT: process.env.PORT,
    db: {
        MongoUserURI: process.env.MongoUserURI
    }
}
module.exports = config