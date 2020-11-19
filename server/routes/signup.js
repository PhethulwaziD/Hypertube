const router = require('express').Router();
const bcrypt = require('bcrypt');
const validate = require('../utilities/validateSignup');
const random =  require('randomstring') 
let User = require('../models/userModel');
const signupmail = require('../utilities/signupmail');
const sendmail = require('../utilities/sendmail');


router.get('/', (req, res) => {
    res.send("It is me signing up")
});

router.post('/', async (req, res) => {
    try {
        console.log(req.body)
        const {firstname, lastname, username, email, password, confirm} = req.body;
        const err = validate(req.body);
        console.log(err);
        if (err)
            return res.json({error: err});
        let user = await User.findOne({username: username})
        if (user)
            return res.json({error: "An account with that username already exists"});
        user = await User.findOne({email: email});
        if (user)
            return res.json({error: "An account with that email already exists"});
       
        bcrypt.hash(password, 10, (err, password) => {
            if (err) throw err;
            verified = 'N';
            reset = "";
            pic = "me.jpeg";
            key = random.generate(28);
            const newUser = new User({ firstname, lastname, username,email, password, verified, pic, key, reset});
            console.log(newUser);
            newUser.save((err, user) => {
                if (err) throw err;
                const options = new signupmail(user.email, user.firstname, user.key);
		        sendmail(options);
                res.json({firstname: user.firstname, lastname:user.lastname});
            });
        });
        
    } catch (error) {
        console.log(error.message)
        res.json({error: error.message});
    }
});

module.exports = router;