const request = require('supertest');
const app = require('../app');
const OrderEventLog = require('../models/OrderEventLog');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

const {
  connectTestDB,
  disconnectTestDB,
  clearTestDB,
  createUserAndToken,
} = require('./helpers/testUtils');

describe('Order Event Log API', () => {
  let adminToken;
  let ownerToken;
  let customerToken;
  let customerUser;

  beforeAll(async () => {
    await connectTestDB();

    const adminData = await createUserAndToken({
      name: 'Admin User',
      email: 'admin-event@test.com',
      password: '123456',
      role: 'admin',
    });

    const ownerData = await createUserAndToken({
      name: 'Owner User',
      email: 'owner-event@test.com',
      password: '123456',
      role: 'owner',
    });

    const customerData = await createUserAndToken({
      name: 'Customer User',
      email: 'customer-event@test.com',
      password: '123456',
      role: 'customer',
    });

    adminToken = adminData.token;
    ownerToken = ownerData.token;
    customerToken = customerData.token;
    customerUser = customerData.user;
  });

  afterEach(async () => {
    await OrderEventLog.deleteMany({});
    await Order.deleteMany({});
    await MenuItem.deleteMany({});
  });

  afterAll(async () => {
    await clearTestDB();
    await disconnectTestDB();
  });

  test('GET /api/event-logs -> admin event logları görebilmeli', async () => {
    const menuItem = await MenuItem.create({
      name: 'Latte',
      description: 'Sütlü kahve',
      price: 120,
      category: 'Kahve',
      image: 'latte.jpg',
      isAvailable: true,
    });

    const order = await Order.create({
      customer: customerUser._id,
      items: [
        {
          menuItem: menuItem._id,
          name: menuItem.name,
          quantity: 2,
          price: menuItem.price,
        },
      ],
      tableNumber: 3,
      totalPrice: 240,
      paymentStatus: 'paid',
      orderStatus: 'received',
    });

    await OrderEventLog.create({
      orderId: order._id,
      eventType: 'ORDER_CREATED',
      tableNumber: 3,
      customerId: customerUser._id,
      totalPrice: 240,
    });

    const res = await request(app)
      .get('/api/event-logs')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.logs)).toBe(true);
    expect(res.body.data.logs.length).toBe(1);
    expect(res.body.data.logs[0].eventType).toBe('ORDER_CREATED');
    expect(res.body.data.logs[0].tableNumber).toBe(3);
  });

  test('GET /api/event-logs -> owner event logları görebilmeli', async () => {
    const res = await request(app)
      .get('/api/event-logs')
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.logs)).toBe(true);
  });

  test('GET /api/event-logs -> customer event logları görememeli', async () => {
    const res = await request(app)
      .get('/api/event-logs')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/event-logs?eventType=ORDER_CREATED -> filtre çalışmalı', async () => {
    const menuItem = await MenuItem.create({
      name: 'Espresso',
      description: 'Sert kahve',
      price: 90,
      category: 'Kahve',
      image: 'espresso.jpg',
      isAvailable: true,
    });

    const order = await Order.create({
      customer: customerUser._id,
      items: [
        {
          menuItem: menuItem._id,
          name: menuItem.name,
          quantity: 1,
          price: menuItem.price,
        },
      ],
      tableNumber: 5,
      totalPrice: 90,
      paymentStatus: 'paid',
      orderStatus: 'received',
    });

    await OrderEventLog.create({
      orderId: order._id,
      eventType: 'ORDER_CREATED',
      tableNumber: 5,
      customerId: customerUser._id,
      totalPrice: 90,
    });

    await OrderEventLog.create({
      orderId: order._id,
      eventType: 'ORDER_STATUS_UPDATED',
      tableNumber: 5,
      customerId: customerUser._id,
      totalPrice: 90,
    });

    const res = await request(app)
      .get('/api/event-logs?eventType=ORDER_CREATED')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.logs.length).toBe(1);
    expect(res.body.data.logs[0].eventType).toBe('ORDER_CREATED');
  });
});