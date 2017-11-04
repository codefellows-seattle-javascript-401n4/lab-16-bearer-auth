'use strict';

const express = require('express');
const jsonParser = require('body-parser').json();
const FileData = require('./model');
const ServerError = require('../lib/error');


const fileRouter = module.exports = express.Router();

function errorCheck(err, body){
  let error = new ServerError(404, 'id does not exist', err);
  error.checkRequired('filemetadata', body);
  return error;
}

fileRouter.get('/visual_files', (req, res, next) => {
  let findObject = req.query || {};
  FileData.find(findObject)
    .then(files => res.status(200).send(files))
    .catch(err => next(new ServerError (404, 'cant find what you are looking for', err)));
});

fileRouter.get('/visual_files/:id', (req, res, next) => {
  FileData.findOne({_id : req.params.id})
    .then(files => res.status(200).send(files))
    .catch(err => next(new ServerError (404, 'cant find what you are looking for', err)));
});

fileRouter.post('/visual_files', jsonParser, (req, res, next) => {
  let newFileData = new FileData(req.body);
  newFileData.save() // saves the file to the database
    .then(data => res.status(200).send(data))
    .catch((err) => {
      next(errorCheck(err, newFileData));
    });
});

fileRouter.patch('/visual_files/:id', jsonParser, (req, res, next) => {
  let newFileData = new FileData(req.body);
  delete newFileData._id;
  FileData.findOneAndUpdate({_id : req.params.id}, {$set:newFileData})
    .then(() => res.status(200).send('success!'))
    .catch((err) => {
      next(errorCheck(err, newFileData));
    });
});

fileRouter.put('/visual_files/:id', jsonParser, (req, res, next) => {
  let newFileData = (new FileData(req.body)).toJSON();
  newFileData._id = null;
  delete newFileData._id;
  FileData.findOneAndUpdate({_id: req.params.id}, newFileData)
    .then(() => {
      res.status(200).send('success!');
    })
    .catch((err) => {
      next(errorCheck(err, newFileData));
    });
});

fileRouter.delete('/visual_files', jsonParser, (req, res, next) => {
  FileData.remove({_id: req.params.id})
    .then(() => res.status(200).send('metadata successfully deleted'))
    .catch((err) => {
      next(errorCheck(err, req.body));
    });
});
