const express = require('express');
const http = require("http");
const socketIo = require("socket.io");
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const PORT = process.env.PORT || 5003

const app = express();

app.use(cors());



const server = http.createServer(app);

global.io = socketIo(server);

app.use(express.json());

app.use(express.static('./public'));

const uri = process.env.DB_URI;
try {
    mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
    const connection = mongoose.connection;
    connection.once('open', () => console.log("Connected to the Database"));    
} catch (error) {
    console.log("Error: "+ error)
}

app.get('/', (req, res) => {
    res.send("I am listening");
})
////
const signin = require('./routes/signin')
app.use('/valid', require('./middleware/auth'))
app.use(require('./routes/signin'));
app.use('/user', require('./routes/user'));
app.use('/signup', require('./routes/signup'));
app.use('/verify', require('./routes/verify'));
app.use('/password', require('./routes/password'));
app.use('/download', require('./routes/download'));
app.use('/downloading', require('./routes/downloading'));
app.use('/movie', require('./routes/movie'))
// app.use('/profile', require('./routes/profile'));
app.use(require('./routes/stream'));

server.listen(PORT, () => console.log("Listening to port: "+ PORT));
