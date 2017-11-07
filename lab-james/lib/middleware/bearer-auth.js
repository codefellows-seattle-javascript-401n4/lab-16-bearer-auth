'use strict';

const jwt = require('jsonwebtoken');
const User = require('../../models/user.js');

module.exports = (req, res, next) => {
  if(!req.headers.authorization){
    throw new Error('You must sign in first');
  }

  let token = req.headers.authorization.split('Bearer ')[1];

  if(!token){
    throw new Error('Invalid authorization');
  }

  let secret = process.env.SECRET;
  let verified = jwt.verify(token, secret);
  req.userId = verified.id;

  next();
};
