'use strict';

const jwt = require('jsonwebtoken');
const User = require('../../models/user.js');

module.exports = (req, res, next) => {
  if(!req.headers.authorization){
    return(
      res.writeHead(400),
      res.write('You must sign in first'),
      res.end()
    );
  }

  let token = req.headers.authorization.split('Bearer ')[1];

  if(!token){
    throw new Error('Invalid authorization');
  }

  let secret = process.env.APP_SECRET;
  let verified = jwt.verify(token, secret);
  req.userId = verified.id;
  User.findOne({_id: req.userId})
    .then(user => {
      if(!user){
        next({statusCode: 403, err: new Error('Invalid user JWT')});
      }
      req.user = user;
      next();
    });
};
