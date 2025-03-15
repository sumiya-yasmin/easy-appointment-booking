## app.js file
### configuration of .env variables
```
const  dotenv  = require('dotenv')
dotenv.config()
```
directly process.env 
```
const port= process.env.PORT
```
or in a seperate config file as object
```
const config = {
    PORT: process.env.PORT,
    db: {
        MongoUserURI: process.env.MongoUserURI
    }
}
```
-dotenv allows you to store this sensitive configuration in a separate .env file, which should never be committed to version control systems like Git.
-dotenv.config() function loads the variables from .env file into process.env

### Connecting Mongodb
```
npm i mongoose
```
```
const connectDB = async() =>{
    console.log('Connecting Mongodb')
    try {
        await mongoose.connect(config.db.MongoUserURI )
        console.log('Mongodb Connected Successfully')
    } catch (error) {
        console.error(`Mongodb connection Failed ${error}`)
    }
}
```
-Mongoose operations are asynchronous.
-Using async/await and try...catch is the preferred way to handle asynchronous operations and errors.
-Using .then().catch() is also a valid way to handle errors.
-With MongoDB Atlas mongodb+srv URIs, you generally don't need to specify the dbName option in mongoose.connect().
