'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const expect = require('expect');
const User = require('../models/user');
const request = require('superagent');
const server = require('../server.js');
const jwt = ('jsonwebtoken');
process.env.DB_URL = 'mongodb://localhost:27017/auth_test';

process.env.PORT = 5500;

beforeAll(() => {
  server.start(process.env.PORT);
  // return User.remove({});
});

afterAll(() => {
  mongoose.connection.close();
  server.stop;
});
describe('Signing a user up' , () =>{
  test('if a unique username is provided as well as a password, test should pass' , () => {
    // let testdata = {username:'validName', password: 'mypass'};
    return request
    .post('http://localhost:5000/api/signup')
    .send({username:'validName', password: 'mypass'})
    .then(res => {
      expect(res.status).toEqual(200);
      expect(typeof res.text).toBe('string');
    });

  });
});
