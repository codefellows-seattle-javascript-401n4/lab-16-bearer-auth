'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lab15', {useMongoClient: true});

app.use('/api', require('../routes/routes.js'));

app.use("*", (req,res,next) => {
    res.sendStatus(404); 
    next();
});

let http = null;
let isRunning = null;

module.exports = {
    start: (port) => {
        if (isRunning) return "Server is already running";
        http = app.listen(port, () => {
            isRunning = true;
            console.log(`Server running in port: ${port}`);
            console.log('Did you ensure your mongdb database is running?');
            if(port === 3000) console.log('Did you create your ENV file?');
        });
    },
    stop: () => {
        if (!isRunning) return "Server is already shut down";
        if (!http) return "Invalid Server";
        http.close(() => {
            http = null;
            isRunning = false;
            console.log('Server shut down.');
        });
    }
}