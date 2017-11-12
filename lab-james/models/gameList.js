'use strict';

const mongoose = require('mongoose');

const gameListSchema = mongoose.Schema({
  games: [{type: mongoose.Schema.Types.ObjectId, ref: 'games'}],
});

module.exports = mongoose.model('gameLists', gameListSchema);
