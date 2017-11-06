'use strict';

const User = require(__dirname + '/../models/user');
const basicHTTP = require(__dirname + '/../lib/basic-http');
const bearerAuthentication = require(__dirname + '/../lib/bearer-auth');
const jsonParser = require('body-parser').json();

const authRouter = module.exports = require('express').Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  const password = req.body.password;
  delete req.body.password;
  (new User(req.body)).generateHash(password)
    .then((user) => {
      user.save()
        .then(user => res.send(user.generateToken()))
        .catch(next);
    })
    .catch(next);
});

authRouter.get('/signin', basicHTTP, (req, res, next) => {
  User.findOne({username: req.auth.username})
    .then(user => {
      if (!user) next({statusCode: 403, message: 'verboden'});
      user.comparePassword(req.auth.password)
        .then(res.send.bind(res))
        .catch(err => next({statusCode: 403, message: 'Auth seys not'}));
      
    }).catch(next);
});

authRouter.get('/moneyFromThisPerson', bearerAuthentication, (req, res, next) => {

  res.send(200, 'ID ' + req.userId);
  // return User.findTheMoney(req.userId);
  //OPTION 1
  //Get a user or a null from the bearer-auth...
  //send out their balance




  //OPTION 2
  //check that JWT is valid
  //if valid...
  //Check that the user is real
  //if the user is real send ot thier balance
  
});