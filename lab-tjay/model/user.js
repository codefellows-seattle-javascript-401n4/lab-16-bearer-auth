'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true, min: 1},
  email: {type: String, required: true, unique: true},
  passwordHash: {type: String, required: true, unique:true},
  tokenSeed: {type: String, unique: true, required: true},
});

userSchema.methods.passwordHashCreate = function(password){
  return bcrypt.hash(password, 8)
  .then(hash => {
    this.passwordHash = hash;
    return this;
  });
};

userSchema.methods.passwordHashCompare = function(password){
  return bcrypt.compare(password, this.passwordHash)
  .then(isAMatch => {
    if (isAMatch) {
      return  this;
    }
    throw new Error('authorization failed. Password did not match');
  });
};

userSchema.methods.tokenSeedCreate = function(){
  return new Promise((resolve, reject) => {
    let attempts = 1;
    let tokenSeedGenerate = () => {
      this.tokenSeed = crypto.randomBytes(32).toString('hex');
      this.save()
      .then(() => resolve(this))
      .catch(() => {
        if (attempts < 1) return reject(new Error('Authorization failed. Server couldn\'t create token'));
        attempts--;
        tokenSeedGenerate();
      });
    };
    tokenSeedGenerate();
  });
};

userSchema.methods.tokenCreate = function(){
  return this.tokenSeedCreate()
  .then(() => {
    return jwt.sign({tokenSeed: this.tokenSeed}, process.env.APP_SECRET);
  });
};

const User = module.exports = mongoose.model('user', userSchema);

User.create = function(data){
  let password = data.password;
  delete data.password;
  return new User(data)
  .passwordHashCreate(password)
  .then(newUser => newUser.tokenCreate());
};