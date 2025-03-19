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

### Zod Schema (Backend):
   - This schema should validate the incoming data from the user.
   - It should mirror the required fields from your Mongoose schema that the user provides.
   - You can add extra validation rules (e.g., minimum length, email format).
   - It is not required for the Zod schema to match the mongoose schema exactly. For example, the created at and updated at fields will not be validated by Zod, as those are backend generated.

```
npm install zod
```
` const signupSchema = z.object({...})` : This is zod validation syntax.

`.refine()` :


  - Cross-Field Validation: It allows you to validate relationships between multiple fields in your data.
  - Custom Logic: You can use any JavaScript logic within the validation function, giving you great flexibility.
  - Clear Error Messages: You can provide specific error messages and associate them with the relevant fields.
  - Clean Code: It keeps your validation logic organized and readable.

`.refine(data => data.password === data.confirmPassword, { ... })`:
   - This is where the cross-field validation happens.
   - data => data.password === data.confirmPassword:
       - This is the validation function.
       - It takes the entire data object (which contains all the fields) as input.
       - It checks if the password field is strictly equal to the confirmPassword field.
       - If they are equal, the validation passes; otherwise, it fails.
   - `{ message: 'Passwords do not match', path: ['confirmPassword'] }`:
       - This is the error configuration.
       - message: 'Passwords do not match': This is the error message that will be returned if the validation fails.
       - path: ['confirmPassword']: This specifies which field the error should be associated with. In this case, it's the confirmPassword field. This is important for frontend frameworks, as it allows you to display the error message next to the correct input field.

### A validation middleware needed for zod schema

- To build a robust and reliable backend applications, a validation middleware is crucial. the `validateRequest` middleware acts as a gatekeeper, ensuring that only valid data is allowed to pass through to the application's core logic. 

- Centralized Validation:
   - It allows you to centralize your validation logic in one place.
   - You can reuse the validateRequest middleware across multiple routes, ensuring consistent validation.

- Clean Route Handlers:
    - It keeps your route handlers clean and focused on business logic.
    - Route handlers don't need to worry about validation details.
- Data Integrity:
    - It ensures that only valid data reaches your route handlers and database.
    - This helps prevent errors, security vulnerabilities, and data corruption.

- Separation of Concerns:
   - It adheres to the principle of separation of concerns, which is a fundamental concept in software engineering.
   - Validation logic is separated from route handling logic.

- Error Handling:
   - It provides a consistent way to handle validation errors.
   - It formats Zod errors into a user-friendly format, making it easier for clients to understand and fix the issues.

```
const validateRequest = (schema) =>{
    return (req,res,next) =>{
        try {
            schema.parse(req.body)
            next()
        } catch (error) {
            if(error instanceof z.ZodError){
                const formattedErrors = error.errors.map( err=> ({
                    path: err.path.join('.'),
                    message: err.message
                }))
                return res.status(400).json({ 
                    error: 'Validation failed', 
                    details: formattedErrors 
                  });
            }
        }
    }
}
```
- We're creating a middleware function that takes a Zod schema as input.
- It validates the request body against the schema.
- If validation passes, it calls the next middleware.
- If validation fails, it formats the error messages and returns a 400 response.

`const validateRequest = (schema) => { ... }`:

- This defines a function named validateRequest.
- It takes a single argument, schema, which is expected to be a Zod schema object.
- This function returns another function (a middleware function).

`return (req, res, next) => { ... }`:

- This is the middleware function that will be executed when a request is made to a route that uses this middleware.
- req: The request object, containing information about the incoming HTTP request.
- res: The response object, used to send responses back to the client.
- next: A function that, when called, passes control to the next middleware in the chain or to the route handler.

`try { schema.parse(req.body); next(); }`:

- `schema.parse(req.body)`:

 - This is the core validation step.
 - It uses the `parse()` method of the Zod schema to validate the request body `(req.body)`.
 - If req.body conforms to the schema, `parse()` returns the parsed data.
 - If req.body does not conform to the schema, `parse()` throws a ZodError.

- `next();`:

 - If the validation is successful (no ZodError is thrown), `next()` is called.
 - This passes control to the next middleware or the route handler, allowing the request to proceed.

`catch (error) { ... }`:

- This catch block handles the ZodError that is thrown when validation fails.

- `const formattedErrors = error.errors.map(err => ({ ... }))`:

  - `error.errors:` This is an array of Zod error objects, each describing a specific validation failure.
  - `map()`: This iterates over the error.errors array and transforms each error object into a more user-friendly format.
  - `path: err.path.join('.')`:
  - `err.path`: This is an array of keys representing the path to the invalid field (e.g., ['user', 'email']).
  - `join('.')`: This converts the path array into a dot-separated string (e.g., "user.email").
  - `message: err.message`:
    - This extracts the error message from the Zod error object.

 - `return res.status(400).json({ ... })`;:
  - This sends a 400 (Bad Request) response to the client.
  - `error: 'Validation failed'`: A general error message.
  - `details: formattedErrors`: The array of formatted error messages, providing specific details about the validation failures.
###
The roles of routers, controllers, and services in a well-structured backend application.
  services -> controllers -> routers

#### Key Benefits of This Structure:

- Separation of Concerns: Each layer has a specific responsibility.
- Maintainability: Changes to one layer are less likely to affect other layers.
- Testability: Services can be easily tested independently.
= Reusability: Services can be reused across different parts of your application.
- Scalability: The architecture supports scaling your application as it grows.

#### 1. Routers (Express.js)

##### Role:
- Routers are responsible for handling HTTP requests and routing them to the appropriate controller functions.
- They define the API endpoints (URLs) and the HTTP methods (GET, POST, PUT, DELETE) that are allowed.
- They often include middleware for authentication, authorization, and validation.

- What to Keep There:
  - Route definitions (e.g., router.get('/users', ...)).
  - Middleware functions (e.g., authentication, validation).
  - Calls to controller functions.
  - Essentially, routing logic.

Example:
// routes/userRouter.js
```
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validateRequest = require('../middleware/validateRequest');
const { userRegistrationSchema, userLoginSchema } = require('../validations/userValidation');

router.post('/register', validateRequest(userRegistrationSchema), userController.registerUser);
router.post('/login', validateRequest(userLoginSchema), userController.loginUser);
router.get('/profile', userController.getUserProfile);

module.exports = router;
```
#### 2. Controllers

##### Role:
- Controllers act as intermediaries between the routers and the services.
- They receive requests from the routers, process the request data, and call the appropriate service functions.
- They handle request/response logic.
- They are responsible for preparing the response data and sending it back to the client.

- What to Keep There:
  - Request handling logic (e.g., extracting data from req.body, req.params, req.query).
  - Calls to service functions.
  - Response formatting and sending.
  - Error handling related to request/response.

Example:
// controllers/userController.js
```
const userService = require('../services/userService');

const registerUser = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
    try{
        const token = await userService.loginUser(req.body);
        res.status(200).json({token: token});
    } catch (error){
        res.status(401).json({error: error.message});
    }
};

const getUserProfile = async (req, res) => {
  try {
    // ... get user from database via service.
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
```
#### 3. Services

##### Role:
- Services contain the core business logic of your application.
- They interact with the data layer (e.g., databases, external APIs).
- They perform data manipulation, validation, and other business operations.
- They are independent of the HTTP layer, making them reusable and testable.

- What to Keep There:
  - Database interactions (e.g., Mongoose queries).
  - Data processing and transformation.
  - Business logic and rules.
  - Calls to other services or external APIs.

Example:
JavaScript

// services/userService.js
```
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = new User({ ...userData, password: hashedPassword });
  await user.save();
  return user;
};

const loginUser = async (loginData) =>{
    const user = await User.findOne({email: loginData.email});
    if(!user){
        throw new Error("Invalid Credentials");
    }
    const passwordMatch = await bcrypt.compare(loginData.password, user.password);
    if(!passwordMatch){
        throw new Error("Invalid Credentials");
    }
    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET);
    return token;
};

module.exports = { registerUser, loginUser };
```
