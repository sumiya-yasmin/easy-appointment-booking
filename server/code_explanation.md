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

### Create the User Model
### Schemas
#### Mongoose Schema (Backend):
- This is the foundation of data model. It defines how data is stored in the database.
- Essential User Data: Always include the core data needed from the user. This is the   data that is absolutely required for the application to function.
- More data can be included in Mongoose schema than initially taken from the user.          
   - createdAt (timestamp of user creation)
   - updatedAt (timestamp of last update)
   - role (user permissions)
   - lastLogin
- These additional fields can be automatically populated by the backend or added later.
##### Create a user model
- Model → Defines the database structure (User.js)
- We define a userSchema with fields like username, email, password, etc.

```
const UserSchema = new mongoose.Schema({})
const User = mongoose.model('User', UserSchema);
```
   - This creates a Mongoose model named User from the userSchema.
   - The User model provides methods for interacting with the "users" collection in the database.


`type: String`: Specifies that the `field` is a string.
`required: [true, 'field' is required']`: Ensures that the  field is mandatory.
`unique: true`: Ensures that no two users have the same value.
`index: true`: Creates an index on the field.
`trim: true`: Removes leading and trailing whitespace.
`minlength: [2, 'field must be at least 2 characters']`: Enforces a minimum length of 2 characters.
`maxlength: [50, 'field must be less than 50 characters']`: Enforces a maximum length of 50 characters.
`validate`: This is a custom validator function.
   - `validator`: Uses the validator library (which you'd need to install: `npm install validator`) to check if the `field` format is valid.
   - `message: 'Invalid 'field' format'`: Provides an error message if the 'field is invalid.

```
email: {
validate: {
    validator: (value) => validator.isEmail(value),
    message: 'Invalid email format',
  },
}
```
`validate`: This is a custom validator function.
   - `validator`: Uses the validator library
   - `message: 'Invalid email format'`: Provides an error message if the email is invalid

```
mobile: {
 validate: {
    validator: (value) => /^\+[1-9]\d{1,14}$/.test(value),
    message:
      'Mobile number must be in international format (e.g., +8801234567)',
  }
}
```
`validate`: This is a custom validator function.
  -`validator: (value) => /^\+[1-9]\d{1,14}$/.test(value)`: Uses a regular expression to validate the mobile number.
    - `^`: Matches the beginning of the string.
    - `\+`: Matches a plus sign.
    - `[1-9]`: Matches a digit from 1 to 9.
    - `\d{1,14}`: Matches 1 to 14 digits.
    - `$`: Matches the end of the string.
  - This pattern validates for a mobile number that starts with a plus sign, followed by  a country code, and then the rest of the number.
  - `message: 'Mobile number must be in international format (e.g., +8801234567)'`: Provides an error message if the mobile number is invalid.

```
password: {
  validate: {
    validator: function (value) {
      // Password should contain at least one uppercase, one lowercase, one number, and one special character
      const hasUppercase = /[A-Z]/.test(value);
      const hasLowercase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecial = /[^A-Za-z0-9]/.test(value);
      return hasUppercase && hasLowercase && hasNumber && hasSpecial;
    },
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  },
}
```
  - `validator: function (value) { ... }`: Defines a function that checks the password's complexity.
  - It uses regular expressions to check for uppercase letters, lowercase letters, numbers, and special characters.
  - It returns true if all conditions are met, and false otherwise.
- `message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'`: Provides an error message if the password doesn't meet the complexity requirement

#### Password Hashing (Important):

- Crucial Security Practice: Passwords are never suggested to store in plain text. Got to always hash them before saving them to the database.
- `bcrypt` Library: Use the `bcrypt` library for password hashing.
- #### Hashing Process:
   - 
    ```
    npm i bcryptjs
    ```
  - When a user registers, hash their password using `bcrypt.hash()` before saving it to the database.
  - When a user logs in, hash the password they entered and compare it to the stored hash using `bcrypt.compare()`.

```
UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
})
```

  - `userSchema.pre('save', async function (next) { ... })`; (Pre-Save Middleware)

      - Purpose:
          -  This is Mongoose middleware that executes before a document is saved to the database.
          -  It's used to perform actions like password hashing, data modification, or validation before the document is persisted.
      - `'save'`:
          - This specifies the event that triggers the middleware. In this case, it's the "save" event, which occurs when you call user.save().
      - `async function (next) { ... }`:
           - This is an asynchronous function that will be executed before the document is saved.
           - `next()`: This function is crucial. It's used to pass control to the next middleware or to the actual save operation. If you don't call `next()`, the document won't be saved.
           - `this`: Within the middleware function, this refers to the document being saved.
      - `if (!this.isModified('password')) return next();`:
           - This is an optimization. It checks if the password field has been modified.
           - `this.isModified('password')`: Returns true if the password field has been changed, and false if it's modified (or new)
           - If the password hasn't been modified, we call next() to proceed with the save operation without hashing.

      - `try { ... } catch (error) { ... }`:
           - This try...catch block handles potential errors during the password hashing process.
      - `const salt = await bcrypt.genSalt(10);`:
           - `bcrypt.genSalt(10)` generates a salt. A salt is a random string that's added to the password before hashing.
           - Using a salt makes password hashing more secure by preventing rainbow table attacks.
           - The 10 is the number of rounds used to generate the salt. Higher numbers increase security but also increase computation time.
      - `this.password = await bcrypt.hash(this.password, salt);`:
           - `bcrypt.hash(this.password, salt)` hashes the password using the generated salt.
           - The hashed password is then assigned back to this.password, replacing the plain-text password.
      - `next();`:
           - After hashing the password, we call next() to proceed with the save operation.
      - `next(error);`:
           - If an error occurs during hashing, we call next(error) to pass the error to Mongoose's error handling.


```
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.comparePassword(candidatePassword, this.password)
};
const User = mongoose.model('User', UserSchema);
module.exports = User;
```

   - `userSchema.methods.comparePassword = async function (candidatePassword) { ... }`; (Instance Method)

       - Purpose:
         - This defines a custom method called comparePassword that will be available on all instances of the User model.
         - It's used to compare a plain-text password with the stored hashed password.
       - `async function (candidatePassword) { ... }`:
          - This is an asynchronous function that takes the candidatePassword (the plain-text password entered by the user) as an argument.
          - `this`: Within the method, this refers to the user document.
       - `return bcrypt.compare(candidatePassword, this.password);`:
          - `bcrypt.compare(candidatePassword, this.password)` compares the candidatePassword with the stored hashed password (this.password).
          - It returns true if the passwords match, and false otherwise.


