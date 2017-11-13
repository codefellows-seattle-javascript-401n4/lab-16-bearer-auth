'use strict';

const Order = require('../models/order');
const bearerAuth = require('../lib/bearer-authentication');
const jsonParser = require('body-parser').json();
const ordersRoutes = module.exports = require('express').Router();

ordersRoutes.post('/orders', jsonParser, bearerAuth, (req, res, next) => {
  if(!req.body) return next({statusCode: 400});
  req.body.userId = req.user._id;
  (new Order(req.body)).save()
    .then(res.send.bind(res))
    .catch(err => {
      next({statusCode: 400});
    })
    .catch(next);
});

ordersRoutes.put('/orders/:id', jsonParser, bearerAuth, (req, res, next) => {
  delete req.body._id;
  Order.findOneAndUpdate({_id: req.params.id}, req.body)

    .then((order) => {
      if(!order) return next({statusCode: 404});
      res.send('Successfully Made A Put Request');

    })
    .catch(next);
});

ordersRoutes.get('/orders', jsonParser, bearerAuth, (req, res, next) => {
  Order.find({userId: req.user._id})
    .then(res.send.bind(res))
    .catch(next);
});

ordersRoutes.get('/orders/:id', jsonParser, bearerAuth, (req, res, next) => {
  Order.find({_id: req.params.id})
    .then(order => {
      console.log(`order: `, order);
      if(!order || (order.length === 0)) return next({statusCode: 404});
      if(order.userId != req.user._id.toString()) return next({statusCode: 403});
      res.send(order).bind(res);
    });
});

ordersRoutes.delete('/orders/:id', jsonParser, bearerAuth, (req, res, next) => {
  Order.find({_id: req.params.id})
    .then(order => {
      if(order.userId != req.user._id.toString()) return next({statusCode: 403});

      Order.remove({_id: req.params.id})
        .then(() => res.send('Successfully Deleted The Order With The Provided Id'))
        .catch(next);
    })
    .catch(next);
});
