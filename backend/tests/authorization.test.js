const request = require('supertest');
const app = require('../app');

const {
  clearDatabase,
  connectTestDB,
  disconnectTestDB,
  createTestUser,
  createAdminUser,
  createOwnerUser,
  getAuthHeader,
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

describe('Role Authorization', () => {
  test('customer -> POST /api/menu yapamamalı', async () => {
    const customer = await createTestUser({
      name: 'Customer',
      email: 'customer@test.com',
      password: '123456',
      role: 'customer',
    });

    const res = await request(app)
      .post('/api/menu')
      .set(getAuthHeader(customer))
      .send({
        name: 'Latte',
        description: 'Sütlü kahve',
        price: 120,
        category: 'Kahve',
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test('waiter -> POST /api/menu yapamamalı', async () => {
    const waiter = await createTestUser({
      name: 'Waiter',
      email: 'waiter@test.com',
      password: '123456',
      role: 'waiter',
    });

    const res = await request(app)
      .post('/api/menu')
      .set(getAuthHeader(waiter))
      .send({
        name: 'Americano',
        description: 'Sade kahve',
        price: 100,
        category: 'Kahve',
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test('kitchen -> POST /api/categories yapamamalı', async () => {
    const kitchen = await createTestUser({
      name: 'Kitchen',
      email: 'kitchen@test.com',
      password: '123456',
      role: 'kitchen',
    });

    const res = await request(app)
      .post('/api/categories')
      .set(getAuthHeader(kitchen))
      .send({
        name: 'Tatlı',
        description: 'Tatlı kategorisi',
        isActive: true,
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test('waiter -> POST /api/tables yapamamalı', async () => {
    const waiter = await createTestUser({
      name: 'Waiter',
      email: 'waiter@test.com',
      password: '123456',
      role: 'waiter',
    });

    const res = await request(app)
      .post('/api/tables')
      .set(getAuthHeader(waiter))
      .send({
        number: 1,
        code: 'TBL-001',
        capacity: 4,
        isActive: true,
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test('customer -> GET /api/reports/summary görememeli', async () => {
    const customer = await createTestUser({
      name: 'Customer',
      email: 'customer@test.com',
      password: '123456',
      role: 'customer',
    });

    const res = await request(app)
      .get('/api/reports/summary')
      .set(getAuthHeader(customer));

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test('waiter -> GET /api/reports/summary görememeli', async () => {
    const waiter = await createTestUser({
      name: 'Waiter',
      email: 'waiter@test.com',
      password: '123456',
      role: 'waiter',
    });

    const res = await request(app)
      .get('/api/reports/summary')
      .set(getAuthHeader(waiter));

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test('owner -> POST /api/menu yapabilmeli', async () => {
    const owner = await createOwnerUser();

    const res = await request(app)
      .post('/api/menu')
      .set(getAuthHeader(owner))
      .send({
        name: 'Mocha',
        description: 'Çikolatalı kahve',
        price: 140,
        category: 'Kahve',
        image: 'https://example.com/mocha.jpg',
        isAvailable: true,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.item.name).toBe('Mocha');
  });

  test('kitchen -> GET /api/orders erişebilmeli', async () => {
    const kitchen = await createTestUser({
      name: 'Kitchen',
      email: 'kitchen@test.com',
      password: '123456',
      role: 'kitchen',
    });

    const res = await request(app)
      .get('/api/orders')
      .set(getAuthHeader(kitchen));

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.orders)).toBe(true);
  });

  test('waiter -> GET /api/orders erişebilmeli', async () => {
    const waiter = await createTestUser({
      name: 'Waiter',
      email: 'waiter@test.com',
      password: '123456',
      role: 'waiter',
    });

    const res = await request(app)
      .get('/api/orders')
      .set(getAuthHeader(waiter));

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.orders)).toBe(true);
  });
});