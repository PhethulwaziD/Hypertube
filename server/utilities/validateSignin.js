const User = require('../models/userModel');
const val = require('./validations');

const validate = (body) => {
    const {username, password} = body;
    if (!username || !password)
        return ("Please fill in all fields");
    if (username.trim().length < 4)
        return ("Invalid username")
    if (password.trim().length < 8)
        return ("Invalid password, must be 8 characters or longer");
    return (null);
}


module.exports = validate;