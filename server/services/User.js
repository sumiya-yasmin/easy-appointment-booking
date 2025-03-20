const User = require("../models/User")

const createUsers = async (payload) =>{
    const newUser =  new User(payload)
    await newUser.save()
    return newUser;
}

module.exports = createUsers;