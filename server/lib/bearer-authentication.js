'use strict';

const jwt = require('jsonwebtoken');
const User = require(__dirname + '/../models/user');

module.exports = (req, res, next) => {

  //check for authorization
  if (!req.headers.authorization) {
    throw new Error('You must authorize');
  }
  //check for a jwt
  let token = req.headers.authorization.split('Bearer ')[1];
  if (!token) {
    throw new Error('Invalid Authorization Provided');
  }

  //extract the Id
  let secret = process.env.SECRET || 'changethis';
  let decodedToken = jwt.verify(token, secret);
  req.userId = decodedToken.id;

  next();
};
