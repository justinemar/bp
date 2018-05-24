require('dotenv').config();
const express = require("express");
const router = require("./routes");
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const storage = multer.memoryStorage();
const server = express();
const mongoose = require("mongoose");
const database = process.env.DB_URL;
mongoose.connect(database);
const db = mongoose.connection;

db.on('error', function(err) {
    console.log(err)
})

db.once('open', function() {
    console.log('connection established')
})


server.use(express.static(path.resolve(__dirname, '../public')));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
// server.use(multer({storage}).array('image', 12));
server.use('/', router);

server.get('*', function(req, res, next) {
  var err = new Error();
  err.status = 404;
  next(err);
});

server.use(function(err, req, res, next) {
  if(err.status !== 404) {
    return next();
  }
  res.status(404);
  res.send(err.message || "We think you're lost.." );
});


var io = require('socket.io').listen(server.listen(process.env.PORT || 8080));



io.on('connection', (socket) => {
    socket.on('statusInit', (status) => {
         io.emit('statusInit', status);
    })

    socket.on('statusComment', (comment) => {
        console.log('SERVER:', comment)
         io.emit('statusComment', comment);
    })
    
    socket.on('statusDelete', (status) => {
        console.log('SERVER:', status)
        io.emit('statusDelete', status);
    })

});


io.on("disconnect",function(socket){

});