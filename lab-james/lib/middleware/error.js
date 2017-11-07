'use strict';

module.exports = (err, req, res, next) => {
  console.log('error', err);

  if(err.statusCode){
    return res.status(err.statusCode).send(err.message);
  }

  return res.status(500).send('Server error');
};
