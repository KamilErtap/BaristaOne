const request = require('supertest');
const app = require('../app');

const {
  clearDatabase,
  connectTestDB,
  disconnectTestDB,
  createAdminUser,
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

describe('Menu API', () => {
  test('GET /api/menu -> boş da olsa menü listesi dönmeli', async () => {
    const res = await request(app).get('/api/menu');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.items)).toBe(true);
  });

  test('POST /api/menu -> admin ürün ekleyebilmeli', async () => {
    const admin = await createAdminUser();

    const res = await request(app)
      .post('/api/menu')
      .set(getAuthHeader(admin))
      .send({
        name: 'Latte',
        description: 'Sütlü kahve',
        price: 120,
        category: 'Kahve',
        image: 'https://example.com/latte.jpg',
        isAvailable: true,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.item.name).toBe('Latte');
  });

  test('POST /api/menu -> token yoksa 401 dönmeli', async () => {
    const res = await request(app)
      .post('/api/menu')
      .send({
        name: 'Latte',
        price: 120,
        category: 'Kahve',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/menu/categories -> kategori listesi dönmeli', async () => {
    const admin = await createAdminUser();

    await request(app)
      .post('/api/menu')
      .set(getAuthHeader(admin))
      .send({
        name: 'Latte',
        description: 'Sütlü kahve',
        price: 120,
        category: 'Kahve',
        image: 'https://example.com/latte.jpg',
        isAvailable: true,
      });

    const res = await request(app).get('/api/menu/categories');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.categories)).toBe(true);
    expect(res.body.data.categories).toContain('Kahve');
  });
});