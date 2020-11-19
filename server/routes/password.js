const router = require('express').Router();
const User = require('../models/userModel');
const validate = require('../utilities/validations').validatePassword;
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.send("Reset password");
});

router.post('/', (req, res) => {
    try {
        const  {reset, password, confirm} = req.body;
        const err = validate(password, confirm)
        if (err)
            return res.json({error: err});
         bcrypt.hash(password, 10, (err, password) => {
             if (err) throw err;
             User.updateOne({reset: reset}, {password: password, reset: ""}, (err, data) => {
                 if (err) throw err;
                 if (data)
                    res.json(true);
             });
         });
            
    } catch (error) {
        res.json({err: error.message})
        console.log(error.message);
    }
});

module.exports = router;