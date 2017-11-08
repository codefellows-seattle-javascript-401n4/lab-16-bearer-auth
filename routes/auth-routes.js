'use strict';


const User = require('../models/user');
const jsonParser = require('body-parser').json();
const authRouter = module.exports = require('express').Router();
const basicHTTP = require('../lib/basic-http');

authRouter.post('/signup', jsonParser,(req, res, next) => {
  const password = req.body.password;
  delete req.body.password;
  //removes the property from req.body
  (new User(req.body)).generateHash(password)
  .then((user) =>{
    user.save()
    .then(user => res.send(user.generateToken()))
    .catch(next);
  })
  .catch(next);
});

authRouter.get('/signin', basicHTTP, (req, res, next) => {
  User.findOne({username: req.auth.username})
  .then(user => {
    if(!user) next({statusCode:403, message: 'forbidden'});
    user.comparePassword(req.auth.password)
    .then(user => res.send(user.generateToken()))
    .catch(err => next({statusCode: 400, message: 'forbidden request'}))
  }).catch(next);
});
