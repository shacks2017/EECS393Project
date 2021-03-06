'use strict';
const http = require('http');
const express = require('express');
const app = express();
const config = require('../config').get();
const db = require('./services/mysql');
const routes = require('./routes');
const bodyParser = require('body-parser');
const responsePromise = require('./middlewares/response-promise');
const morgan = require('morgan');
const cors = require('cors');

db.connect().then((connection) => {
    return require('./models/sync')();
}).then(() => {
    setUpAPI();
});

const server = http.Server(app);

server.listen(process.env.PORT || config.app.port);
console.log(`Server listening on port ${process.env.PORT || config.app.port}`);


function setUpAPI() {
    //General middlewares
    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(responsePromise);
    //Mount routes
    const router = express.Router();
    routes(router);
    app.use('/', router);
    
    router.get('/', (req, res) => res.sendFile(__dirname + "/frontend/index.html"));
    router.get('/css', (req, res) => res.sendFile(__dirname + "/frontend/style.css"));
    router.get('/js', (req, res) => res.sendFile(__dirname + "/frontend/script.js"));

    router.get('/posts/:pid', (req, res) => res.sendFile(__dirname + "/frontend/index2.html"));
    router.get('/js2', (req, res) => res.sendFile(__dirname + "/frontend/script2.js"));
}

