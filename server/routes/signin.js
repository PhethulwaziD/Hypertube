const router = require('express').Router();
const bcrypt = require('bcrypt');
const validate = require('../utilities/validateSignin');
const jwt = require('jsonwebtoken')
let User = require('../models/userModel');


router.get('/signin', (req, res) => {

    res.send("It is me signing in here")
});

router.post('/signin', async (req, res) => {
    try {
        console.log("Loging Request")
        const {username, password} = req.body;
        console.log(req.body)
        const err = validate(req.body);
        if (err) return res.json({error: err}); 
        console.log(err)
        const user = await User.findOne({username: username})
       
        if (!user) return res.json({error: "The username you've entered does not exist, please sign up"});
        if (user.verified === 'N') return res.json({error: "Account not verified, please confirm your email account before you try signing in"});
        bcrypt.compare(password, user.password, (err, bool) => {
            if (err) throw err;
            if (!bool) return res.json({error: "Invalid username or passsword"});
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            console.log("user")
            console.log(user);
            res.json({token, user});
        })
        
    } catch (error) {
        res.json({err: error.message});
    }
});

module.exports = router;