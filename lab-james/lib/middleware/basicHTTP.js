'use strict';

module.exports = (req, res, next) => {
  try{
    let authHead = req.headers.authorization;
    let base64Head = authHead.split('Basic ')[1];
    let base64Buf = new Buffer(base64Head, 'base64');
    let stringifiedHead = base64Buf.toString();
    let authArray = stringifiedHead.split(':');
    let authObject = {
      username: authArray[0],
      password: authArray[1],
    };

    if(!authObject.username || !authObject.password){
      throw new Error('Bad username and/or password');
    }

    req.auth = authObject;
    next();
  }
  catch(err){
    next(err);
  }
};
