'use strict';

const User = require('../models/user.js');
const basicHTTP = require('../lib/middleware/basicHTTP.js');
const jsonParser = require('body-parser').json();

const authRouter = module.exports = require('express').Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  if(!req.body.username){
    return(
      res.writeHead(400),
      res.write('Username required'),
      res.end()
    );
  }

  if(!req.body.password){
    return(
      res.writeHead(400),
      res.write('Password required'),
      res.end()
    );
  }

  const password =req.body.password;
  delete req.body.password;

  let newUser = new User(req.body);
  newUser.hashPass(password)
    .then(user => {
      user.save()
        .then(user => {
          res.send(user.generateToken());
        })
        .catch(err => {
          next(err);
        });
    })
    .catch(err => {
      next(err);
    });
});

authRouter.get('/signin', basicHTTP, (req, res, next) => {
  User.findOne({username: req.auth.username})
    .then(user => {
      if(!user){
        next({statusCode: 404, message: 'User not found'});
      }

      user.checkPass(req.auth.password)
        .then(user => {
          res.send(user.generateToken());
        })
        .catch( () => {
          next({statusCode: 401, message: 'Invalid password'});
        });
    })
    .catch(err => {
      next(err);
    });
});
