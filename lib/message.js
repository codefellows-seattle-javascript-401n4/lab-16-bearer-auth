'use strict';

module.exports = (res, statusCode, message) => {
    res.status(statusCode).send(message);
};