'use strict';

module.exports = (req, res, next) => {
        let authHeader = req.headers.authorization;
        if (!authHeader) return next(new Error('No auth Header'));
    
        let base64 = authHeader.split('Basic ')[1];
        let base64Buffer = new Buffer(base64, 'base64');
        let stringHeader = base64Buffer.toString();
        let authArray = stringHeader.split(':');
        let authObject = {username: authArray[0], password: authArray[1]};

        req.auth = authObject;
        next();

}