'use strict';

const server = require('../lib/server.js');
const User = require('../models/user.js');
const superagent = require('superagent');
const jwt = require('jsonwebtoken');
process.env.APP_SECRET = 'testsecret';

beforeAll( () => {
  server.start();
  return User.remove({});
});

describe('User sign up and sign in', function(){

  test('should be able to create a new user', function(){
    return superagent.post('http://localhost:3000/signup')
      .set('content-type', 'application/json')
      .send({
        username: 'Tester',
        password: 'Test1234',
      })
      .then(res => {
        let verified = jwt.verify(res.text, 'testsecret');
        expect(verified.id.length).not.toBe(0);
        return User.findOne({username: 'Tester'})
          .then(user => {
            expect(user._id.toString()).toEqual(verified.id);
          });
      });
  });

  test('should respond with a 400 if no username or password sent', function(){
    return superagent.post('http://localhost:3000/signup')
      .set('content-type', 'application/json')
      .send({
        username: 'Tester',
      })
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toBe(400);
      });
  });

  test('should be able to sign in', function(){
    return superagent.get('http://localhost:3000/signin')
      .auth('Tester', 'Test1234')
      .then(res => {
        let verified = jwt.verify(res.text, 'testsecret');
        expect(verified.id.length).not.toBe(0);
        return User.findOne({username: 'Tester'})
          .then(user => {
            expect(user._id.toString()).toEqual(verified.id);
          });
      });
  });

  test('should respond with a 404 if user not found', function(){
    return superagent.get('http://localhost:3000/signin')
      .auth('Wrong', 'Test1234')
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toBe(404);
      });
  });

  test('should respond with a 401 with bad password', function(){
    return superagent.get('http://localhost:3000/signin')
      .auth('Tester', 'Wrong')
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toBe(401);
      });
  });

});
