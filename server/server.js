require('dotenv').config();
const express = require("express");
const router = require("./routes/routes");
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
server.use(multer({storage}).single('image'));
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

server.listen(process.env.PORT || 8080);

