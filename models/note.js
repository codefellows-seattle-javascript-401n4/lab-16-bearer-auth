'use strict';

const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  noteBody: {type: String, required: true, unique: true},
  userId: String,
});
//mongodb turns these into tables, lowercases, and pluralizes
module.exports = mongoose.model('Note', noteSchema);
