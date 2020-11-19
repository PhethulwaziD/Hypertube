const User = require('../models/userModel');
const val = require('./validations');

const validate = (body) => {
    const {firstname, lastname, username ,email, password, confirm} = body;
    if (!firstname || !lastname || !username || !email || !password || !confirm)
        return ("Please fill in all fields");
    if (firstname.trim().length  === 0)
        return ("Invalid firstname, must be atleast 1 character or longer h");
    if (lastname.trim().length  === 0)
        return ("Invalid lastname, must be atleast 1 character or longer");
    if (username.trim().length  === 0 || username.trim().length < 4 )
        return ("Invalid username, must be atleast 4 characters or longer");
    let err = val.validateEmail(email);
    if (err)
        return (err);
    err = val.validatePassword(password, confirm)
    if (err)
        return (err);
    return (null);
}

module.exports = validate;