/*globals beforeAll, afterAll, expect*/
'use strict';

const request = require('superagent');
const mongoose = require('../../lib/mongooseDB');
const app = require('../../lib/server');
const User = require('../../user/model');

process.env.DB_URL = 'mongodb://localhost:27017/user_test';
process.env.PORT = 8000;
const PORT =  process.env.PORT;
const url = `localhost:${PORT}/api/v1/users`;
let server;

describe('user API', () => {

  beforeAll(() => {
    const DB = process.env.DB_URL;
    mongoose.connect(DB, {useMongoClient: true});
    server = app.listen(PORT);
  });

  beforeEach(() => {
    return User.remove({});
  });

  afterAll(() => {
    User.remove({});
    return mongoose.connection.close(function(){
      server.close();
    });
  });

  describe('POST', () => {

    test('it should create a user', () => {
      let testdata = new User({name:'name', group: 'group'});
      return request
        .post(url)
        .send(testdata)
        .then((res) => {
          expect(res.status).toEqual(200);
          res = res.body; //
          expect(res.name).toEqual('name');
        });
    });

    test('it responds with 400 if no body', () => {
      return request
        .post(url)
        .send()
        .catch(err => {
          expect(err.status).toEqual(400);
          expect(err.response.error.text).toEqual('errors: need a name,');
        });
    });
  });

  describe('GET', () => {
    test('it should get an array of users', () => {
      return request
        .get(url)
        .then(res => {
          expect(res.status).toBe(200);
          res = res.body;
          expect(Array.isArray(res));
        });
    });

    test('it should get a single user given a valid id', () => {
      let testdata = new User({name:'get-name', description: 'description-to-get', path: 'test-path'});
      (testdata).save()
        .then((filedata) => {
          return request
            .get(`${url}/${filedata._id}`)
            .then(res => {
              expect(res.status).toBe(200);
              res = res.body;
              expect(res.name).toBe('get-name');
            });
        });
    });

    test('it should respond with 404 if not an valid id', () => {
      return request
        .get(`${url}/test-id`)
        .catch((err) => {
          expect(err.status).toEqual(404);
          expect(err.response.error.text).toEqual('cant find what you are looking for');
        });
    });
  });

  describe('PUT', () => {
    test('it should update with a put', () => {
      let testdata = new User({name:'name', group: 'group'});
      let changeddata = {name:'new-name', group: 'group'};
      return (testdata).save()
        .then((file) => {
          return request
            .put(`${url}/${file._id}`)
            .send(changeddata)
            .then(res => {
              expect(res.status).toBe(200);
              expect(res.text).toBe('success!');
            });
        });
    });

    test('it should respond with 404 if not found', () => {
      let changeddata = {name:'new-put-name', group: 'test-group-new'};
      return request
        .put(`${url}/id`)
        .send(changeddata)
        .catch(err => {
          expect(err.status).toEqual(404);
          expect(err.response.error.text).toEqual('id does not exist');
        });
    });

    test('it should respond with 400 if no body', () => {
      let testdata = new User({name:'put-name', group: 'team'});
      (testdata).save()
        .then((file) => {
          return request
            .put(`${url}/${file._id}`)
            .send()
            .catch(err => {
              expect(err.status).toEqual(400);
              expect(err.response.error.text).toEqual('errors: need a name,');
            });
        });
    });
  });

});
