const request = require('supertest');
const app = require('../src/index');

describe('GET /products', () => {
  it('should return list of products', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.products).toBeDefined();
  });
});

describe('GET /products/:id', () => {
  it('should return a single product', async () => {
    const res = await request(app).get('/products/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.product.name).toBe('Laptop');
  });

  it('should return 404 for unknown product', async () => {
    const res = await request(app).get('/products/999');
    expect(res.statusCode).toBe(404);
  });
});
