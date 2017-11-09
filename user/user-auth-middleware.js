'use strict';
const User = require(__dirname + '/model');


let userHandler = module.exports = {};

userHandler.getUserByName = (req, res, next) => {
  User.findOne({name: req.auth.username})
    .then(user => {
      if (!user) {
        return next({statusCode: 400, message: 'no user'});
      }
      req.user = user;
      next();
    })
    .catch(next);
};

userHandler.getUserById = (req, res, next) => {
  User.findOne({_id: req.user._id})
    .then(user => {
      if (!user) {
        return next({statusCode: 400, message: 'no user'});
      }
      req.user = user;
      next();
    })
    .catch(next);
};

userHandler.signIn = (req, res, next) => {
  req.user.comparePassword(req.auth.password)
    .then(user => {
      if (user instanceof Error) {
        next({statusCode: 401, message: user.message});
      }
      res.send(user.generateToken());
    })
    .catch(err =>
      next({statusCode: 403, message: err.message}));
};

userHandler.createUser = (req, res, next) => {
  const password = req.body.password;
  delete req.body.password;
  (new User(req.body)).generateHash(password)
    .then((user) => {
      user.save()
        .then(user => {
          res.send(user.generateToken());
        })
        .catch(err => next({statusCode: 400, message: err.message}));
    })
    .catch(err => next({statusCode: 400, message: err.message}));
};
