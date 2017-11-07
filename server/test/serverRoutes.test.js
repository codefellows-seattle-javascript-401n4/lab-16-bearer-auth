'use strict';

const request = require('superagent'); //a client
const authRouter = require(__dirname + '/../routes/auth-routes.js');
const jsonParser = require('body-parser').json();
const service = 'localhost:3000';
process.env.MONGODB_URI = 'mongodb://localhost:27017/auth_dev';
const server = require('../server');

//my token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhMDAxMmEzOTA3MzU5OWQ5NDllODI5YyIsImlhdCI6MTUwOTk1NDIxMX0.2dNkPQil08MdKjl6SBH0MkYBIZEesvfplJPPZFUhln0
//use this website to extract id out from the token https://jwt.io/
//id = 5a0012a39073599d949e829c


describe('GET /signin', () => {
  it('should respond with a 200, for valid requests made with a valid id, returns a valid body, which is the token', () => {

    let basicToken = new Buffer(`PeanutButter:yummyyum`).toString('base64');
    let url = `http://${service}/signin`;

    return request
    .get(url)
    .set('Authorization', `Basic ${basicToken}`)
    .then(res => {
      expect(res.status).toEqual(200);
      expect(res.text).not.toBe(null);
      console.log(`res.text: `, res.text);
    });
  });

  it('should respond with a 500, if no basic token was provided', () => {
    return request
    .get('http://localhost:3000/signin')
    .set('Authorization', `Basic `)
    .catch(res => {
      expect(res.status).toEqual(500);
    });
  });
});

// describe('GET /showMyAccount', () => {
//   it('should send a valid body, ');
// });
