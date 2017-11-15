'use strict';

const createError = require('http-errors');
const User = require('../model/user.js');

module.exports = (req, res, next) => {
  console.log('Hit basicAuth');
  const {authorization} = req.headers;
  if (!authorization) return next(createError('authorization failed, no authorization provided'));

  let encoded = authorization.split('Basic ')[1];
  if (!encoded) return next(createError('authorization failed, no basic64 encoded authorization provided'));

  let decoded = new Buffer(encoded, 'base64').toString();
  let [username, password] = decoded.split(':');
  if (!username || !password) return next(createError('authorization failed, username or password is missing'));

  User.findOne({username})
  .then(user => {
    if (!user) return next(createError('authorization failed, no user was found'));
    return user.passwordHashCompare(password);
  })
  .then(user => {
    req.user = user;
    next();
  })
  .catch(() => {
    return next(createError('authorization failed, password failed to match'));
  });
};