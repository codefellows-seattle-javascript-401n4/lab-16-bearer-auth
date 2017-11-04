const express = require('express');
const User = require(`${__dirname}/../models/User.js`);
const jsonParser = require('body-parser').json();
const auth = require('../lib/basic-http');

const Router = module.exports = express.Router();

Router.get('/signin', auth, (req, res, next) => {
    User.findOne({username: req.auth.username}).then(user => {
        user.comparePassword(req.auth.password).then(user => {
            
            (user) ? res.status(200).send(user.generateToken()) : res.status(401).send('Passwords did not match.');
        });
    }); 
});

Router.post('/signup', jsonParser, (req, res, next) => {
    if ((typeof req.body.username === 'undefined') || (typeof req.body.password === 'undefined')) {
        res.send({statusCode: 400, message: 'Invalid or missing body'});
    } else {
        const password = req.body.password;
        delete req.body.password;
        (new User(req.body)).generateHash(password).then(user => {
            user.save()
                 .then(saved => res.send(saved))
                 .catch(next);
        });  
    }
});
