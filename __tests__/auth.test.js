const dotenv = require('dotenv');
dotenv.config();
const request = require('supertest');
const app = require('../app'); 
const server = app.server; 

const username = process.env.TESTUSER_USERNAME;
const password = process.env.TESTUSER_PASSWORD;

describe('Authentication API', () => {
  it('should return a token when a valid user logs in', async () => {
  const response = await request(app)
    .post('/login')
    .send({ username, password });

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('token');
}, 10000); 

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });
});
