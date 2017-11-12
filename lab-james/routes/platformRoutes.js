'use strict';

const express = require('express');
const jsonParser = require('body-parser').json();
const Platform = require('../models/platform.js');
const bearerAuth = require('../lib/middleware/bearer-auth.js');

const platformRouter = module.exports = express.Router();

platformRouter.post('/platforms', jsonParser, bearerAuth, (req, res, next) => {

  if(!req.body.name){
    return(
      res.writeHead(400),
      res.write('Platform name required'),
      res.end()
    );
  }

  let newPlatform = new Platform(req.body);

  newPlatform.save()
    .then(platform => {
      res.send(platform);
    })
    .catch(err => {
      next(err);
    });
});

platformRouter.get('/platforms', bearerAuth, (req, res, next) => {
  Platform.find({})
    .then(platforms => {
      res.send(platforms);
    })
    .catch(err => {
      next(err);
    });
});

platformRouter.get('/platforms/:id', bearerAuth, (req, res, next) => {
  let id = req.params.id;
  if(!id){
    return(
      res.writeHead(400),
      res.write('ID required'),
      res.end()
    );
  }

  Platform.findOne({_id: id})
    .then(platform => {
      res.send(platform);
    })
    .catch( () => {
      return(
        res.writeHead(404),
        res.write('platform ID not found'),
        res.end()
      );
    });
});


platformRouter.delete('/platforms/:id', bearerAuth, (req, res, next) => {
  let id = req.params.id;

  Platform.remove({_id: id})
    .then( () => {
      res.send('Platform deleted');
    })
    .catch( () => {
      return(
        res.writeHead(404),
        res.write('platform ID not found'),
        res.end()
      );
    });
});

platformRouter.delete('/platforms', bearerAuth, (req, res, next) => {
  return(
    res.writeHead(400),
    res.write('ID required'),
    res.end()
  );
});
