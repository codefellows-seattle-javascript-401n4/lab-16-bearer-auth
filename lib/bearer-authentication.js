'use strict';

const jwt = require('jsonwebtoken');
const User = require(__dirname + '/../models/user' );

module.exports = (req, res, next) => {
  if (! req.headers.authorization){
    throw new Error('You must auth');
  }
  //check that we even have a jwt
  let token = req.headers.authorization.split('Bearer ')[1];

  if( ! token ){
    throw new Error('invalid authorization provided');
  }
  //take id out of it
  let secret = process.env.SECRET || 'error';
  let decodedToken = jwt.verify(token, secret);

  console.log('this is the decoded token: ', decodedToken);
  //didnt finish typing its broke, look at 1908 in video
  User.findOne({_id: decodedToken})
  .then(user => {
    req.userId = user._id;
    console.log('setting id ', req.userId);
    next();
  })
  .catch(next);
  // // console.log('id: ', req.userId)
  // .then(user =>{
  //   if(!user) next({statusCode: 403, err: new Error('no such user corresponding to jwt')});
  //   req.user = user;
  //   next();
  // });
};
