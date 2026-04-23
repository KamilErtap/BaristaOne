const request = require('supertest');
const app = require('../app');

const {
  clearDatabase,
  connectTestDB,
  disconnectTestDB,
  createTestUser,
  createAdminUser,
  getAuthHeader,
} = require('./helpers/testUtils');

const MenuItem = require('../models/MenuItem');

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

describe('Orders API', () => {
  test('POST /api/orders -> customer sipariş oluşturabilmeli', async () => {
    const customer = await createTestUser({
      name: 'Customer User',
      email: 'customer@test.com',
      password: '123456',
      role: 'customer',
    });

    const latte = await MenuItem.create({
      name: 'Latte',
      description: 'Sütlü kahve',
      price: 120,
      category: 'Kahve',
      image: 'https://example.com/latte.jpg',
      isAvailable: true,
    });

    const res = await request(app)
      .post('/api/orders')
      .set(getAuthHeader(customer))
      .send({
        items: [
          {
            menuItem: latte._id.toString(),
            quantity: 2,
          },
        ],
        tableNumber: 4,
        paymentStatus: 'paid',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.order.tableNumber).toBe(4);
    expect(res.body.data.order.totalPrice).toBe(240);
    expect(res.body.data.order.orderStatus).toBe('received');
  });

  test('POST /api/orders -> payment paid değilse 400 dönmeli', async () => {
    const customer = await createTestUser({
      name: 'Customer User',
      email: 'customer@test.com',
      password: '123456',
      role: 'customer',
    });

    const latte = await MenuItem.create({
      name: 'Latte',
      description: 'Sütlü kahve',
      price: 120,
      category: 'Kahve',
      image: 'https://example.com/latte.jpg',
      isAvailable: true,
    });

    const res = await request(app)
      .post('/api/orders')
      .set(getAuthHeader(customer))
      .send({
        items: [
          {
            menuItem: latte._id.toString(),
            quantity: 1,
          },
        ],
        tableNumber: 2,
        paymentStatus: 'pending',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/orders/my-orders -> kullanıcı kendi siparişlerini görebilmeli', async () => {
    const customer = await createTestUser({
      name: 'Customer User',
      email: 'customer@test.com',
      password: '123456',
      role: 'customer',
    });

    const americano = await MenuItem.create({
      name: 'Americano',
      description: 'Sade kahve',
      price: 100,
      category: 'Kahve',
      image: 'https://example.com/americano.jpg',
      isAvailable: true,
    });

    await request(app)
      .post('/api/orders')
      .set(getAuthHeader(customer))
      .send({
        items: [
          {
            menuItem: americano._id.toString(),
            quantity: 1,
          },
        ],
        tableNumber: 3,
        paymentStatus: 'paid',
      });

    const res = await request(app)
      .get('/api/orders/my-orders')
      .set(getAuthHeader(customer));

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.orders)).toBe(true);
    expect(res.body.data.orders.length).toBe(1);
    expect(res.body.data.orders[0].tableNumber).toBe(3);
  });

  test('GET /api/orders -> admin tüm siparişleri görebilmeli', async () => {
    const customer = await createTestUser({
      name: 'Customer User',
      email: 'customer@test.com',
      password: '123456',
      role: 'customer',
    });

    const admin = await createAdminUser();

    const mocha = await MenuItem.create({
      name: 'Mocha',
      description: 'Çikolatalı kahve',
      price: 140,
      category: 'Kahve',
      image: 'https://example.com/mocha.jpg',
      isAvailable: true,
    });

    await request(app)
      .post('/api/orders')
      .set(getAuthHeader(customer))
      .send({
        items: [
          {
            menuItem: mocha._id.toString(),
            quantity: 1,
          },
        ],
        tableNumber: 5,
        paymentStatus: 'paid',
      });

    const res = await request(app)
      .get('/api/orders')
      .set(getAuthHeader(admin));

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.orders)).toBe(true);
    expect(res.body.data.orders.length).toBe(1);
    expect(res.body.data.orders[0].tableNumber).toBe(5);
  });

  test('PUT /api/orders/:id/status -> admin sipariş durumunu güncelleyebilmeli', async () => {
    const customer = await createTestUser({
      name: 'Customer User',
      email: 'customer@test.com',
      password: '123456',
      role: 'customer',
    });

    const admin = await createAdminUser();

    const cappuccino = await MenuItem.create({
      name: 'Cappuccino',
      description: 'Köpüklü kahve',
      price: 130,
      category: 'Kahve',
      image: 'https://example.com/cappuccino.jpg',
      isAvailable: true,
    });

    const createRes = await request(app)
      .post('/api/orders')
      .set(getAuthHeader(customer))
      .send({
        items: [
          {
            menuItem: cappuccino._id.toString(),
            quantity: 1,
          },
        ],
        tableNumber: 1,
        paymentStatus: 'paid',
      });

    const orderId = createRes.body.data.order._id;

    const updateRes = await request(app)
      .put(`/api/orders/${orderId}/status`)
      .set(getAuthHeader(admin))
      .send({
        orderStatus: 'preparing',
      });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.success).toBe(true);
    expect(updateRes.body.data.order.orderStatus).toBe('preparing');
  });

  test('GET /api/orders -> customer admin sipariş listesine erişememeli', async () => {
    const customer = await createTestUser({
      name: 'Customer User',
      email: 'customer@test.com',
      password: '123456',
      role: 'customer',
    });

    const res = await request(app)
      .get('/api/orders')
      .set(getAuthHeader(customer));

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });
});