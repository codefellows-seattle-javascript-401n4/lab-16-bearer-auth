'use strict';

const jwt = require('jsonwebtoken');
const User = require(__dirname + '/../models/user');

module.exports = (req, res, next) => {

  if(!req.headers.authorization) {
    throw new Error('You must authorize!');
  }
    
  let token = req.headers.authorization.split('Bearer ')[1];
  if (!token) {
    throw new Error('Invalid Authoization Provided');
  }
 
  let secret = process.env.SECRET || 'changethis';
  let decodedToken = jwt.verify(token, secret);

  User.findOne({_id:decodedToken.id})
    .then(user => {
      req.userId = user._id;
      next();
    })
    .catch(next);

};  