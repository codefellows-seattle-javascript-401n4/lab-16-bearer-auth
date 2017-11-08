'use strict';

const jwt = require('jsonwebtoken')
const User = require('__dirname + /../models/user')
module.exports = (req, res, next) => {
  if (! req.headers.authorization){
    throw new Error('You must auth')
  }
  //check that we even have a jwt
let token = req.headers.authorization.split('Bearer ')[1];
if( ! token ){
  throw new Error('invalid authorization provided');
}
//take id out of it
let secret = process.env.SECRET || 'change this';
let decodedToken = jwt.verify(token, secret);

User.findOne({_id}: decodedToken.id)
.then(user =>{
  req.user = user._id;
})
.catch(next)

};
