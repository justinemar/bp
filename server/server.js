require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const server = express();
const mongoose = require('mongoose');

const database = process.env.DB_URL;
mongoose.connect(database, { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', (err) => {
    console.log(err);
});

db.once('open', () => {
    console.log('connection established');
});

const io = require('socket.io').listen(server.listen(process.env.PORT || 8080));
const routes = require('./routes');

server.use(express.static(path.resolve(__dirname, '../public')));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(routes);
server.get('*', (req, res, next) => {
    const err = new Error();
    err.status = 404;
    next(err);
});

// eslint-disable-next-line consistent-return
server.use((err, req, res, next) => {
    if (err.status !== 404) {
        return next();
    }
    res.status(404);
    res.send(err.message || "We think you're lost..");
});

io.on('connection', (socket) => {
    socket.on('statusInit', (status) => {
        io.emit('statusInit', status);
    });

    socket.on('notification', (notification) => {
        io.emit('notification', notification);
    });

    socket.on('statusComment', (comment) => {
        io.emit('statusComment', comment);
    });

    socket.on('statusDelete', (status) => {
        io.emit('statusDelete', status);
    });
});
