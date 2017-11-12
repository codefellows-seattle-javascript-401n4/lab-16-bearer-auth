'use strict';

const mongoose = require('mongoose');
const GameList = require('./gameList.js');

const platformSchema = mongoose.Schema({
  name: {type: String, required: true},
  gameList: {type: mongoose.Schema.Types.ObjectId, ref: 'gameLists'},
});

platformSchema.pre('save', function(done){
  GameList.findById(this.gameList)
    .then(gameList => {
      if(!gameList){

        let newGameList = new GameList({});
        return newGameList.save();

      } else {

        return gameList;

      }
    })
    .then(passedGameList => {
      this.gameList = passedGameList._id;
    })
    .then( () => {
      done();
    })
    .catch(done);
});

platformSchema.pre('findOne', function(done){
  this.populate({
    path: 'gameList',
    populate: {
      path: 'games',
    },
  });
  done();
});

module.exports = mongoose.model('platforms', platformSchema);
