'use strict';

const mongoose = require('mongoose');
const GameList = require('./gameList.js');
const Platform = require('./platform.js');

const gameSchema = mongoose.Schema({
  name: {type: String, required: true},
  platforms: {type: mongoose.Schema.Types.ObjectId, ref: 'platforms'},
  gameList: {type: mongoose.Schema.Types.ObjectId, ref: 'gameLists'},
});

gameSchema.pre('save', function(done){
  Platform.findById(this.platforms)
    .then(platform => {
      if(!platform){

        return Promise.reject();

      } else {

        this.platforms = platform._id;
        this.gameList = platform.gameList._id;
        return Promise.resolve(this.gameList);

      }
    })
    .then( (gameList) => {
      GameList.findOneAndUpdate(
        {_id: gameList},
        {$addToSet: {games: this._id} }
      )
        .then(Promise.resolve())
        .catch(err => {
          Promise.reject(err);
        });
    })
    .then( () => {
      done();
    })
    .catch(done);
});

gameSchema.pre('findOne', function(done){
  this.populate({
    path: 'platforms',
    populate: {
      path: 'gameList',
      populate: {
        path: 'games',
      },
    },
  });
  done();
});

module.exports = mongoose.model('games', gameSchema);
