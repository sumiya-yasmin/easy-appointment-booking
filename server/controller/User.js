const createUsers = require("../services/user")

const users = async (req, res) =>{
    const payload = req.body
    try {
        const newUser = await createUsers(payload);
        res.status(201).json({ message: `user added successfully`, user: newUser });   
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = users;