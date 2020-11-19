const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        firstname: { type: String, required: true, trim: true, minlength: 1 },
        lastname: { type: String, required: true, trim: true, minlength: 1 },
        username: { type: String, required: true, trim: true, minlength: 1 },
        email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: false, trim: true, minlength: 8 },
        verified: { type: String, required: false, trim: true, minlength: 1 },
        pic: {type: String},
        key: { type: String},
        reset: { type: String }
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;