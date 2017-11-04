'use strict';

const jwt = require('jsonwebtoken');
const User = require(__dirname + "/../models/user");

module.exports = (res, req, next);

  if( ! req.headers.authorization) {
    throw new Error("you must authorize");
  }

  let token = req.headers.authorization.split('Bearer ')[1];
  if (! token ) {
    throw new Error("Invalid Authorization Provided");
  }

  //Take the ID out of it
  let secret = process.env.SECRET || "changethis";
  let decodedToken = jwt.verify(token, secret);

  User.findOne({_id}:decodedToken.id)
      .then(user => {
        req.userId = user._id;
        next();
      })
