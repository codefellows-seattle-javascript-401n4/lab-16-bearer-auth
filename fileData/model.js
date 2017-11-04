//mongo schema
'use strict';

const mongoose = require('mongoose');
const User = require('../user/model');

const fileMetaDataSchema = new mongoose.Schema({
  name: {type: String, required: true},
  date: {type: Date, default: Date.now()},
  user : {type: mongoose.Schema.Types.ObjectId, ref:'users'},
  path : {type: String, required: true, unique: true},
  description : {type: String, required: true},
});


fileMetaDataSchema.pre('save', function(done){
  User.findById(this.user)
    .then(user => {
      if (! user) {
        let newUser = new User({name: 'name'});
        return newUser.save();
      }
      else { return user; }
    })
    .then( user => this.user = user._id )
    .then( () => done() )
    .catch(console.log);
});

fileMetaDataSchema.pre('findOne', function(){
  this.populate('users');
});

module.exports = mongoose.model('filemetadata', fileMetaDataSchema); // collection, Schema, creates constructor function
