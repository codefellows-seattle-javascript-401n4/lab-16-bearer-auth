'use strict';

const mongoose = require('mongoose');
const token = require('jsonwebtoken');
const bcrypt = require('bluebird').promisifyAll(require('bcrypt'));

const User = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},

});

User.methods.hashify = function(pw) {
  return bcrypt.hash(pw, 10)
    .then(data => {
      this.password = data;
      return this;

    });
};

//need to refactor so as not to use 2 return statements.
User.methods.checkPassword = function(password) {
  return bcrypt.compare(password, this.password)
    .then(res => {
      if(!res) throw new Error('The password you entered was incorrect.');
      //else
      return this;

    });
};

User.methods.createToken = function() {
  let idObject = {id: this._id};
  return token.sign(idObject, process.env.SECRET);

};

module.exports = mongoose.model('User', User);
