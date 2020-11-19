const router = require('express').Router();
const bcrypt = require('bcrypt')
const path = require('path');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const validate = require('../utilities/validations').validateEmail;
const validatePassword = require('../utilities/validations').validatePassword;
const random =  require('randomstring');
const passwordmail = require('../utilities/passwordmail');
const sendmail = require('../utilities/sendmail');
var multer  = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
  })

var upload = multer({ storage: storage });

router.get('/', (req, res) => {
    res.send("user");
});


router.post('/', (req, res) => {
    try {
        const token  = req.header('x-auth-token')
        if (!token) return res.json(false);
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if (!verified) return res.json(false);
        User.findById(verified.id, (err, data) => {
            if (err) throw err
            return res.json(
                {
                    id: data._id,
                    firstname: data.firstname, 
                    lastname: data.lastname, 
                    email: data.email, 
                    pic: data.pic, 
                    username: data.username});
        });   
    } catch (error) {
        res.json({err: error.message})
        console.log(error.message);
    }
});

router.post('/reset', (req, res) => {
    try {
        console.log("Reset password request");
        const err = validate(req.body.email);
        if (err)
            return res.json({error: err});
        User.findOne({email: req.body.email}, (err, data) => {
            if (err) throw err
            if (!data)  return res.json({error: "User does not exist, please sign up"});
            const reset = random.generate(28);
            const options = new passwordmail(req.body.email, data.firstname, reset);
            sendmail(options);
            User.updateOne({email: req.body.email}, {reset: reset}, (err, data) => {
                if (err) throw err;
                if (data)
                   res.json(true);
            })
        });   
    } catch (error) {
        res.json({err: error.message})
        console.log(error.message);
    }
});

router.post('/upload', upload.single('file'), (req, res) => {
    if (req.files === null) return res.json({error: "No file uploaded"});
    const file = req.file;
    const email = req.body.email;
    const err = validateUpload(email, file);
    if (err) return res.json({error: err});``
    const newData = {pic: file.filename};
    return updateData(email, newData, res);
});



router.post('/update', (req, res) => {
    try {
        if (req.body.firstname && req.body.email) updateFirstaname(req.body, res);
        else if (req.body.lastname && req.body.email) updateLastname(req.body, res);
        else if (req.body.username && req.body.email) updateUsername(req.body, res); 
        else if (req.body.email && req.body.email) updateEmail(req.body, res); 
        else if (req.body.password && req.body.confirm && req.body.email) updatePassword(req.body, res); 
        else return res.json({error: "Invalid input"});    
    } catch (error) {
        res.json({err: error.message})
    }
    
})

const validateUpload = (email, file) => {
    const ext = path.extname(file.originalname)
    if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
        const err = validate(email);
        if (err)
            return (err);
        return null;    
    }
    return ("Invalid file extension");
    
}

const updateFirstaname = (body, res) => {
    const {firstname, email} = body;
    let err = validateInput(firstname, email);
    if (err) return res.json({error: err});
    const newData = {firstname: firstname};
    return updateData(email, newData, res);
}

const updateLastname = (body, res) => {
    const {lastname, email} = body;
    let err = validateInput(lastname, email);
    if (err) return res.json({error: err});
    const newData = {lastname: lastname};
    return updateData(email, newData, res);
}

const updateUsername = (body, res) => {
    const {username, email} = body;
    let err = validateInput(username, email);
    if (err) return res.json({error: err});
    if (username.trim().length < 4) return res.json({error: "Invalid username must be 4 characters or longer"});
    const newData = {username: username};
    return updateData(email, newData, res);
}

const updateEmail = (body, res) => {
    const {email, oldemail} = body;
    let err = validateInput(email, oldemail);
    if (err) return res.json({error: err});
    err = validate(email);
    if (err) return res.json({error: err});
    err = validateNewEmail(email);
    if (err) return res.json({error: err});
    const newData = {email: email};
    return updateData(oldemail, newData, res);
}

const updatePassword = (body, res) => {
    try {
        const {password, confirm, email} = body;
        let err = validatePassword(password, confirm);
        if (err) return res.json({error: err});  
        bcrypt.hash(password, 10, (err, password) => {
            if (err) throw err;
            const newData = {password: password};
            return updateData(email, newData, res); 
        })       
    } catch (error) {
        res.json({err: error.message})
    }
}

const validateInput = (input, email) => {
    if (!input)
        return ("Please fill in a field before you change");
    if (input.trim().length  === 0)
        return ("Invalid input, must be atleast 1 character or longer");
    return (validate(email))
}

const updateData = (email, newData, res) => {
    try {
        User.findOne({email: email}, (err, data) => {
            if (err) throw err
            if (!data)  return res.json({error: "No user with your credentials found"});
            User.updateOne({email: email}, newData, (err, data) => {
                if (err) throw err;
                if (data) res.json(newData);
            })
        });
    } catch (error) {
        return res.json({error: error.message});
    }
}

const validateNewEmail = (email) => {
   try {
        User.findOne({email: email}, (err, data) => {
            if (err) throw err
            if (data) return "Unfortunately a user with that email already exists";
            return null;
        });   
   } catch (error) {
       return (error.message)
   } 
}
module.exports = router;