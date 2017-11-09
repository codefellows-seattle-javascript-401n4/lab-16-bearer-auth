'use strict';

const jwt = require('jsonwebtoken');
const User = require(__dirname + '/../models/user');

module.exports = (req, res, next) => {

  //check for authorization
  if (!req.headers.authorization) {
    throw new Error('You must authorize');
  }
  //check for a jwt
  console.log('req.headers.authorization' + req.headers.authorization);
  let token = req.headers.authorization.split('Bearer ')[1];
  if (!token) {
    throw new Error('Invalid Authorization Provided');
  }

  //extract the Id
  let secret = process.env.SECRET || 'changethis';
  let decodedToken = jwt.verify(token, secret);
  req.userId = decodedToken.id;
  User.findOne({_id: req.userId})
    .then(user => {
      if(!user) next ({statusCode: 403, err: new Error('User Not Found With The Corresponding JWT')});
      req.user = user;
      next();
    });
};
