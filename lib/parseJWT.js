'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
require('dotenv').config();


module.exports = (req) => {
    req.parseJWT = {};
    "Bearer kjasnfsdkjfnslkdafjnasldkfjnasdf"

    if (typeof req.headers.authorization === 'undefined') {
        req.parseJWT.message = 'No headers.';
    } else {
        let token = req.headers.authorization.split('Bearer ')[1] || null;

            try {
                let verified = jwt.verify(token , process.env.SECRET || 'change this') || null;
                req.parseJWT.verified = verified.id;
            } catch (err) {
                req.parseJWT.verified = false;
            }
    }
    return req.user.verified = true;
};
