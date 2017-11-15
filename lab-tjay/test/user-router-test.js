'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
const expect = require('expect');
const superagent = require('superagent');
const server = require('../lib/server.js');
const clearDB = require('./lib/clear-db.js');
const mockUser = require('./lib/mock-user.js');
const API_URL = process.env.API_URL;

describe('Testing for user routes', (done) => {

  before(function() {
    server.start();
  });
  after(function() {
    server.stop();
  });
  afterEach(function() {
    clearDB();
  });

  describe('Baseline Pass Test', () => {
    it('Should F***ing pass', () =>{
      expect('Yes').toEqual('Yes');
    })
  })

  describe('Testing POST route /api/signup', () => {
    describe('If the post is successful', () => {
      it('It should return a token', (done) => {
        return superagent.post(`${API_URL}/api/signup`)
        .send({username: 'dingo', email: 'dogs@example.com', password: 'secret password'})
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.text).toExist();
          expect(res.text.length > 1).toBeTruthy();
          done();
        });
      });
    });

    describe('If inputting bad pathname', () => {
      it('It should return a 404 status', (done) => {
        return superagent.post(`${API_URL}/api/badpath`)
        .send({username: 'dingo', email: 'dogs@example.com', password: 'secret password'})
        .catch(res => {
          expect(res.status).toEqual(404);
          done();
        });
      });
    });

    describe('If inputting invalid body content', () => {
      it('It should return a 401 status', (done) => {
        return superagent.post(`${API_URL}/api/signup`)
        .send({username: 587, email: 'dogs@example.com', password: 'secret password'})
        .catch(res => {
          expect(res.status).toEqual(401);
          done();
        });
      });
    });

    describe('If inputting NO body content', () => {
      it('It should return a 401 status', (done) => {
        return superagent.post(`${API_URL}/api/signup`)
        .send({})
        .catch(res => {
          expect(res.status).toEqual(401);
          done();
        });
      });
    });
  });

  describe('Testing GET route /api/signin', () => {

    describe('If the get is successful', () => {

      it('It should return a token', (done) => {
        let tempUser = {};
        return mockUser.createOne()
        .then(newUser => {
          tempUser = newUser;
          let encoded = new Buffer(`${tempUser.user.username}:${tempUser.password}`).toString('base64');
          return superagent.get(`${API_URL}/api/signin`)
          .set('Authorization', `Basic ${encoded}`);
          done();
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.text).toExist();
          expect(res.text.length > 1).toBeTruthy();
          done();
        });
      });
    });

    describe('If the user forgets to put in a username', () => {

      it('It should return a 401 status and missing username||pw message', (done) => {
        let tempUser = {};
        return mockUser.createOne()
        .then(newUser => {
          tempUser = newUser;
          let encoded = new Buffer(`${tempUser.password}`).toString('base64');
          return superagent.get(`${API_URL}/api/signin`)
          .set('Authorization', `Basic ${encoded}`);
          done();
        })
        .catch(err => {
          expect(err.status).toEqual(401);
          done();
        });
      });
    });

    describe('If the user puts in a bad username', () => {

      it('It should return a 401 status and no user found message', (done) => {
        let tempUser = {};
        return mockUser.createOne()
        .then(newUser => {
          tempUser = newUser;
          let encoded = new Buffer(`badusername:${tempUser.password}`).toString('base64');
          return superagent.get(`${API_URL}/api/signin`)
          .set('Authorization', `Basic ${encoded}`);
          done();
        })
        .catch(err => {
          expect(err.status).toEqual(401);
          done();
        });
      });
    });

    describe('If the user puts in a bad password', () => {

      it('It should return a 401 status and no password didnt match message', (done) => {
        let tempUser = {};
        return mockUser.createOne()
        .then(newUser => {
          tempUser = newUser;
          let encoded = new Buffer(`${tempUser.user.username}:badpassword`).toString('base64');
          return superagent.get(`${API_URL}/api/signin`)
          .set('Authorization', `Basic ${encoded}`);
          done();
        })
        .catch(err => {
          expect(err.status).toEqual(401);
          done();
        });
      });
    });
  });
});