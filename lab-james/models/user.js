'use strict';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bluebird').promisifyAll(require('bcrypt'));

const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
});

userSchema.methods.hashPass = function(password){
  return bcrypt.hashAsync(password, 10)
    .then( (hashedPass) => {
      this.password = hashedPass;
      return this;
    })
    .catch(err => {
      console.log(err);
    });
};

userSchema.methods.checkPass = function(password){
  return bcrypt.compareAsync(password, this.password)
    .then(res => {
      if(res){
        return this;
      }

      throw new Error('Invalid password');
    })
    .catch(err => {
      console.log(err);
    });
};

userSchema.methods.generateToken = function(){
  return jwt.sign({id: this._id}, process.env.APP_SECRET || 'placeholder');
};

module.exports = mongoose.model('user', userSchema);
