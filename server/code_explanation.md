## app.js file
```
dotenv.config()

const port= process.env.PORT
```

-dotenv allows you to store this sensitive configuration in a separate .env file, which should never be committed to version control systems like Git.
-dotenv.config() function loads the variables from .env file into process.env
