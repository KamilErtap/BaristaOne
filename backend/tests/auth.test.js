const request = require('supertest');
const app = require('../app');

const {
  clearDatabase,
  connectTestDB,
  disconnectTestDB,
  createTestUser,
} = require('./helpers/testUtils');

beforeAll(async () => {
  await connectTestDB();
});

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await disconnectTestDB();
});

describe('Auth API', () => {
  test('POST /api/auth/register -> kullanıcı kayıt olmalı', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Kamil',
        email: 'kamil@test.com',
        password: '123456',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.name).toBe('Kamil');
    expect(res.body.data.user.email).toBe('kamil@test.com');
    expect(res.body.data.token).toBeDefined();
  });

  test('POST /api/auth/register -> eksik alanlarda 400 dönmeli', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'kamil@test.com',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBeDefined();
  });

  test('POST /api/auth/login -> kullanıcı giriş yapmalı', async () => {
    await createTestUser({
      name: 'Kamil',
      email: 'kamil@test.com',
      password: '123456',
      role: 'customer',
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'kamil@test.com',
        password: '123456',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe('kamil@test.com');
  });

  test('POST /api/auth/login -> yanlış şifre ile 401 dönmeli', async () => {
    await createTestUser({
      name: 'Kamil',
      email: 'kamil@test.com',
      password: '123456',
      role: 'customer',
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'kamil@test.com',
        password: 'wrongpass',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/auth/me -> token ile kullanıcı bilgisi dönmeli', async () => {
    const user = await createTestUser({
      name: 'Kamil',
      email: 'kamil@test.com',
      password: '123456',
      role: 'customer',
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'kamil@test.com',
        password: '123456',
      });

    const token = loginRes.body.data.token;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(user.email);
  });
});