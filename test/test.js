'use strict';

require("dotenv").config();
const expect = require('expect');
const app = require('../lib/server.js');
const request = require('superagent');
const User = require('../models/User.js');
let username = 'testingUsername';
let newUsername = 'newUsername';
let password = 'testingPassword';
let token = '';


// describe('Create a password for testing the token', done => {
//     before(done => {
//         User.remove({username: newUsername}).then(() => {
//             app.start(process.env.PORT || 3000);
//             done();
//         });
//     });
//
//     after(done => {
//         app.stop();
//         done();
//     });
//
//     it('Should create a new user "testingUsername"', function(done) {
//         User.remove({username: username}).then(() => {
//             request.post(`localhost:${process.env.PORT || 3000}/api/signup`).send({username: username, password: password}).then(response => {
//                 // successful response
//                expect(response.status).toEqual(200);
//                expect(response.body.username).toEqual(username);
//                done();
//             });
//         });
//     });
// });
//
// describe('Attempt to log in with the new account and get back a jwt token', (done) => {
//     before(done => {
//         app.start(process.env.PORT || 3000);
//         done();
//     });
//
//     after(done => {
//         app.stop();
//         done();
//     });
//
//     it('Should return a jwt token after login', done => {
//         request.get(`localhost:${process.env.PORT || 3000}/api/signin`).auth(username, password).then(response => {
//             expect(response.status).toEqual(200);
//             token = response.text;
//             done();
//         });
//     });
// });
//
describe('Testing PUT route with JWT token', done => {
    before(done => {
        app.start(process.env.PORT || 3000);
        done();
    });

    after(done => {
        app.stop();
        done();
    });

    it('Should return 400 if Bearer auth is not found', done => {
        request.put(`localhost:${process.env.PORT || 3000}/api/update/newUsername`).end((err, response) => {

            expect(response.status).toEqual(401);
            expect(response.text).toEqual('You did not send headers.');
            done();
        });
    });

    it('Should throw us a 401 if an invalid token is provided', done => {
        request.put(`localhost:${process.env.PORT || 3000}/api/update/${newUsername}`).set(`Authorization`, `Bearer 651651`).end((err, response) => {
            expect(response.status).toEqual(401);
            expect(response.text).toEqual("Your token was invalid.");
            done();
        });
    });

    it('Should return 200 and change our username from testingUsername to newUsername', done => {
        request.put(`localhost:${process.env.PORT || 3000}/api/update/${newUsername}`).set(`Authorization`, `Bearer ${token}`).end((err, response) => {
            expect(response.body.username).toEqual('newUsername');
            expect(response.status).toEqual(200);
            done();
        });
    });
});
