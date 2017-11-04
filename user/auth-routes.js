'use strict';

const User = require(__dirname + '/model');
const basicHttp = require(__dirname + '/../lib/basic-http');
const jsonParser = require('body-parser').json();

const authRouter = module.exports = require('express').Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  const password = req.body.password;
  delete req.body.password;
  (new User(req.body)).generateHash(password)
    .then((user) => {
      user.save()
        .then(user => {
          res.send(user.generateToken());
        })
        .catch(err => next({statusCode: 403, message: err.message}));
    })
    .catch(err => next({statusCode: 403, message: err.message}));
});

authRouter.get('/signin', basicHttp, (req, res, next) => {
  User.findOne({name: req.auth.username})
    .then(user => {
      if (!user) return next({statusCode: 403, message: 'no user'});
      user.comparePassword(req.auth.password)
      //take id of user, put it json web token, using jsonwebtoken
        .then(user => {
          if (user instanceof Error) {
            next({statusCode: 401, message: user.message});
          }
          res.send(user.generateToken());
        })
        .catch(err => next({statusCode: 403, message: err.message}));
    });
});
