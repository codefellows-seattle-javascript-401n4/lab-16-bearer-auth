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

beforeAll(done => {
    User.remove({username: newUsername}).then(() => {
        app.start(process.env.PORT || 3000);
        done();
    });
});

afterAll(done => {
    app.stop();
});




test('Create a simple user with password for later testing our token on', done => {

        User.remove({username: username}).then(() => {
            request.post(`localhost:${process.env.PORT || 3000}/api/signup`).send({username: username, password: password}).then(response => {
                // successful response
               expect(response.status).toEqual(200);
               expect(response.body.username).toEqual(username);
               done();
            });
        });
});



test('Attept to log in with our new account and get back a jwt token', (done) => {

        request.get(`localhost:${process.env.PORT || 3000}/api/signin`).auth(username, password).then(response => {
            expect(response.status).toEqual(200);

            token = response.text;
            done();
        });
});

test('Testing our new PUT route with our JWT token 400', done => {

    // `Authorization`, `Bearer ${token}`

        request.put(`localhost:${process.env.PORT || 3000}/api/update/hello`).end((err, response) => {
            expect(response.status).toEqual(400);
            expect(response.text).toEqual('You did not send headers.');
            done();
        });

});

test('Testing our new PUT route with our JWT token 401', done => {

    // `Authorization`, `Bearer ${token}`


        request.put(`localhost:${process.env.PORT || 3000}/api/update/${newUsername}`).set(`Authorization`, `Bearer 651sdfsdfsd`).end((err, response) => {

            expect(response.status).toEqual(401);
            expect(response.text).toEqual("Your token was invalid.");
            done();
        });

});

test('Testing our new PUT route with our JWT token 200', done => {



        request.put(`localhost:${process.env.PORT || 3000}/api/update/${newUsername}`).set(`Authorization`, `Bearer ${token}`).end((err, response) => {
      
            expect(response.body.username).toEqual('newUsername');
            expect(response.status).toEqual(200);
            done();
        });

});