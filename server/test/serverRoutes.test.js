// 'use strict';
//
// const request = require('superagent'); //a client
// const User = require(__dirname + '/../models/user');
// const jwt = require('jsonwebtoken');
// const authRouter = require(__dirname + '/../routes/auth-routes.js');
// const jsonParser = require('body-parser').json();
// const service = 'localhost:3000';
// process.env.MONGODB_URI = 'mongodb://localhost:27017/auth_test';
// process.env.SECRET = 'testsecret';
// const server = require(__dirname + '/../server');
//
// // let express = require('express');
// // let app = express;
//
// //my token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhMDAxMmEzOTA3MzU5OWQ5NDllODI5YyIsImlhdCI6MTUwOTk1NDIxMX0.2dNkPQil08MdKjl6SBH0MkYBIZEesvfplJPPZFUhln0
// //use this website to extract id out from the token https://jwt.io/
// //id = 5a0012a39073599d949e829c
// beforeAll(() => {
//   server.start();
//   return User.remove({});
// });
//
// afterAll(() => {
//   server.stop();
// });
//
//
// describe('/signup', () => {
//   it('should be able to create a user', () => {
//     return request
//     .post('localhost:3000/signup')
//     .send({username: 'test', password: 'testPassword'})
//     .then(res => {
//       let decoded = jwt.verify(res.text, 'testsecret');
//       expect(decoded.id.length).not.toBe(0);
//       return User.findOne({username: 'test'})
//       .then(user => expect(user._id.toString()).toEqual(decoded.id));
//     });
//   });
// });
//
// describe('GET /signin', () => {
//   it('should respond with a 200, for valid requests made with a valid id, returns a valid body, which is the token', () => {
//
//     let basicToken = new Buffer(`test:testPassword`).toString('base64');
//     let url = `http://${service}/signin`;
//
//     return request
//     .get(url)
//     .set('Authorization', `Basic ${basicToken}`)
//     .then(res => {
//       expect(res.status).toEqual(200);
//       expect(res.text).not.toBe(null);
//     });
//   });
//
//   it('should respond with a 500, if no basic token was provided', () => {
//     return request
//     .get('http://localhost:3000/signin')
//     .set('Authorization', `Basic `)
//     .catch(res => {
//       expect(res.status).toEqual(500);
//     });
//   });
// });
//
// describe('GET /showMyAccount', () => {
//   it('should respond with 200 and send a valid body', () => {
//     let myJWT = '';
//     let basicToken = new Buffer(`test:testPassword`).toString('base64');
//     let signinurl = `http://${service}/signin`;
//     request
//     .get(signinurl)
//     .set('Authorization', `Basic ${basicToken}`)
//     .then((res) => {
//
//       myJWT = res.text;
//       console.log(`myJWT :`, myJWT);
//       let url = `http://${service}/showMyAccount`;
//       return request
//       .get(url)
//       .set('Authorization', 'Bearer ' + myJWT)
//       .then(res => {
//         console.log(`hi from test Authorization`);
//         expect(res.text).not.toBe(null);
//         console.log('res.text showMyAccount: ' + res.text);
//       });
//
//     });
//   });
// });
//
//
// it('should be able to sign in a user', () => {
//   return request
//     .get('localhost:3000/signin')
//     .auth('test', 'testPassword')
//     .then(res => {
//       let decoded = jwt.verify(res.text, 'testsecret');
//       expect(decoded.id.length).not.toBe(3);
//       return User.findOne({username: 'test'})
//         .then(user => expect(user._id.toString()).toEqual(decoded.id));
//     });
// });
