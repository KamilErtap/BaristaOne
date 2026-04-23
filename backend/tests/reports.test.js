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

describe('Reports API', () => {
  test('GET /api/reports/summary -> admin raporu görebilmeli', async () => {
    const customer = await createTestUser({
      name: 'Customer User',
      email: 'customer@test.com',
      password: '123456',
      role: 'customer',
    });

    const admin = await createAdminUser();

    const latte = await MenuItem.create({
      name: 'Latte',
      description: 'Sütlü kahve',
      price: 120,
      category: 'Kahve',
      image: 'https://example.com/latte.jpg',
      isAvailable: true,
    });

    await request(app)
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

    const res = await request(app)
      .get('/api/reports/summary')
      .set(getAuthHeader(admin));

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    expect(res.body.data.summary).toBeDefined();
    expect(res.body.data.summary.totalOrders).toBe(1);
    expect(res.body.data.summary.totalRevenue).toBe(240);

    expect(Array.isArray(res.body.data.topProducts)).toBe(true);
    expect(Array.isArray(res.body.data.categoryBreakdown)).toBe(true);
    expect(Array.isArray(res.body.data.tableBreakdown)).toBe(true);
    expect(Array.isArray(res.body.data.recentOrders)).toBe(true);
  });

  test('GET /api/reports/summary -> owner raporu görebilmeli', async () => {
    const owner = await createOwnerUser();

    const res = await request(app)
      .get('/api/reports/summary')
      .set(getAuthHeader(owner));

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.summary).toBeDefined();
  });

  test('GET /api/reports/summary -> customer raporu görememeli', async () => {
    const customer = await createTestUser({
      name: 'Customer User',
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

  test('GET /api/reports/summary -> top products ve category breakdown doğru oluşmalı', async () => {
    const customer = await createTestUser({
      name: 'Customer User',
      email: 'customer@test.com',
      password: '123456',
      role: 'customer',
    });

    const admin = await createAdminUser();

    const latte = await MenuItem.create({
      name: 'Latte',
      description: 'Sütlü kahve',
      price: 120,
      category: 'Kahve',
      image: 'https://example.com/latte.jpg',
      isAvailable: true,
    });

    const brownie = await MenuItem.create({
      name: 'Brownie',
      description: 'Tatlı',
      price: 90,
      category: 'Tatlı',
      image: 'https://example.com/brownie.jpg',
      isAvailable: true,
    });

    await request(app)
      .post('/api/orders')
      .set(getAuthHeader(customer))
      .send({
        items: [
          { menuItem: latte._id.toString(), quantity: 3 },
          { menuItem: brownie._id.toString(), quantity: 1 },
        ],
        tableNumber: 2,
        paymentStatus: 'paid',
      });

    const res = await request(app)
      .get('/api/reports/summary')
      .set(getAuthHeader(admin));

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const { topProducts, categoryBreakdown, tableBreakdown } = res.body.data;

    const latteReport = topProducts.find((item) => item.name === 'Latte');
    const kahveCategory = categoryBreakdown.find((item) => item.category === 'Kahve');
    const table2 = tableBreakdown.find((item) => item.tableNumber === 2);

    expect(latteReport).toBeDefined();
    expect(latteReport.quantity).toBe(3);

    expect(kahveCategory).toBeDefined();
    expect(kahveCategory.quantity).toBe(3);

    expect(table2).toBeDefined();
    expect(table2.orderCount).toBe(1);
  });
});