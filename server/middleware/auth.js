const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const router  = require('express').Router();

router.get('/', (req, res) => {
    res.send("hello");
})

router.post('/',(req, res) => {
    try {
        if (req.body.reset)
        {
            User.findOne({reset: req.body.reset}, (err, data) => {
                if (err) throw err
                if (!data)
                    return res.json(false);
                return res.json(true);    
            })
        } else {
            const token  = req.header('x-auth-token');
            console.log("token "+token);
            if (!token) return res.json(false);
            const verified = jwt.verify(token, process.env.JWT_SECRET)
        
            if (!verified) 
                return res.json(false);
            User.findById(verified.id, (err, data) => {
                if (err) throw err
                if (!data) 
                    return res.json(false);
                return res.json(true);
            });
        }
           
    } catch (error) {
        if (error)
            res.json({err: error.message});
    }    
});

module.exports = router;
 