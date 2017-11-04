'use strict';

const app = module.exports = require('express')();
const fileDataRouter = require(__dirname + '/../fileData/file-routes');
const userRouter = require(__dirname + '/../user/user-routes');

app.use('/api/v1', fileDataRouter);
app.use('/api/v1', userRouter);

app.use((err, req, res, next) => {
  console.log(err.status, err.message);
  let status = err.status || 500;
  let message = err.message || 'oh no server error';
  res.status(status).send(message);
  next();
});
