const router = require('express').Router();
const User = require('../models/userModel');

router.get('/', (req, res) => {
    res.send("user");
});

router.post('/', (req, res) => {
    try {
        const key  = req.body.key;
        if (!key) return res.json(false);
        User.findOne({key: key}, (err, data) => {
            if (err) throw err;
            if (!data) return res.json(false);
            User.updateOne({key: key}, {key: "", verified: "Y"}, (err, data) =>{
                if (err) throw err;
                res.json(true);
            })
        });   
    } catch (error) {
        res.json({err: error.message})
        console.log(error.message);
    }
});

module.exports = router;