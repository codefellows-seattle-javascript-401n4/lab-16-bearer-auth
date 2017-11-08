'use strict';

// require('dotenv').config();
const request = require('superagent');
const expect = require('expect');
const User = require('../models/user');
const mongoose = require('mongoose');
const url = 'http://localhost:5500';

process.env.MONGODB_URI = 'monogdb://localhost/users-test';
process.env.PORT = 5500;



beforeAll(() => {
  require('../lib/_server').start(process.env.PORT);
  return User.remove({});
});

afterAll(() => {
  mongoose.connection.close();
  require('../lib/_server').stop;
});

let exampleUser = {
  username:'studley',
  password:'12345'
};

let jwtToken = '';

describe()
