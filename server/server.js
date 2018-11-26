require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const services = require('./services/api');

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

const io = require('./helpers/sockets');

io.listen(server.listen(process.env.PORT || 8080));
const routes = require('./routes');

server.use(express.static(path.resolve(__dirname, '../public')));
server.set('views', path.join(__dirname, './helpers/template'));
server.set('view engine', 'pug');
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use((req, res, next) => {
    console.log('token middleware');
    const token = req.headers.authorization.slice(7 - req.headers.authorization.length);
    jwt.verify(token, process.env.KEY1, (err, decoded) => {
        if (err) {
            res.status(401).json({
                message: 'Your session has expired, please login to continue where you left off',
                type: 'error',
                code: 401,
            });
        }

        if (decoded) {
            next();
        }
    });
});

server.use((err, req, res, next) => {
    if (err.status !== 404) {
        return next();
    }
    res.status(404);
    res.send(err.message || "We think you're lost..");
});

server.use(services);
server.use(routes);
