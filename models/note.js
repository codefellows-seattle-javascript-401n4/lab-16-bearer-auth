'use strict';

const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  noteBody: {type: String, required: true, unique: true},
  userId: {type: String, required: true}
});
//mongodb turns these into tables, lowercases, and pluralizes
module.exports = mongoose.model('Note', userSchema);
