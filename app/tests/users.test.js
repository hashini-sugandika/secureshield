const request = require('supertest');
const app = require('../src/index');

describe('GET /users', () => {
  it('should return list of users', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.users).toBeDefined();
  });
});

describe('POST /users', () => {
  it('should reject invalid email', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'Test', email: 'not-an-email' });
    expect(res.statusCode).toBe(400);
  });

  it('should create a valid user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'Charlie', email: 'charlie@example.com' });
    expect(res.statusCode).toBe(201);
  });
});
