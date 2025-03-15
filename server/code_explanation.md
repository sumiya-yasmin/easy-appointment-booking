## app.js file
```
dotenv.config()

const port= process.env.PORT
```

-dotenv allows you to store this sensitive configuration in a separate .env file, which should never be committed to version control systems like Git.
-dotenv.config() function loads the variables from .env file into process.env

### Connecting Mongodb
```
npm i mongoose
```
-Mongoose operations are asynchronous.
-Using async/await and try...catch is the preferred way to handle asynchronous operations and errors.
-Using .then().catch() is also a valid way to handle errors.
