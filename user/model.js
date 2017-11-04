//mongo schema
'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  group: {type: String},
  password : {type: String, require: true},
  email : {type: String, require: true}
  assets : [{}],
});

module.exports = mongoose.model('users', userSchema); // collection, Schema, creates constructor function
