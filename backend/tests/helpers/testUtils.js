const mongoose = require('mongoose');
const User = require('../../models/User');
const MenuItem = require('../../models/MenuItem');
const Order = require('../../models/Order');
const Category = require('../../models/Category');
const Table = require('../../models/Table');
const OrderEventLog = require('../../models/OrderEventLog');
const generateToken = require('../../utils/generateToken');

const assertTestDatabase = () => {
  const dbName = mongoose.connection.name;
  const mongoUri = process.env.MONGO_URI || '';

  const isTestEnv = process.env.NODE_ENV === 'test';
  const isTestDb =
    dbName?.toLowerCase().includes('test') ||
    mongoUri.toLowerCase().includes('test');

  if (!isTestEnv || !isTestDb) {
    throw new Error(
      `Güvenlik kilidi: Test dışı database temizlenemez. NODE_ENV=${process.env.NODE_ENV}, DB=${dbName}, MONGO_URI=${mongoUri}`
    );
  }
};

const clearDatabase = async () => {
  assertTestDatabase();

  await User.deleteMany();
  await MenuItem.deleteMany();
  await Order.deleteMany();
  await Category.deleteMany();
  await Table.deleteMany();
  await OrderEventLog.deleteMany();
};

const createTestUser = async ({
  name = 'Test User',
  email = 'test@example.com',
  password = '123456',
  role = 'customer',
} = {}) => {
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  return user;
};

const clearTestDB = clearDatabase;

const createUserAndToken = async (userData) => {
  const user = await createTestUser(userData);
  const token = generateToken(user._id);

  return {
    user,
    token,
  };
};

const createAdminUser = async () => {
  return createTestUser({
    name: 'Admin User',
    email: 'admin@test.com',
    password: '123456',
    role: 'admin',
  });
};

const createOwnerUser = async () => {
  return createTestUser({
    name: 'Owner User',
    email: 'owner@test.com',
    password: '123456',
    role: 'owner',
  });
};

const getAuthHeader = (user) => {
  const token = generateToken(user._id);
  return {
    Authorization: `Bearer ${token}`,
  };
};

const connectTestDB = async () => {
  if (mongoose.connection.readyState === 1) {
    assertTestDatabase();
    return;
  }

  await mongoose.connect(process.env.MONGO_URI);
  assertTestDatabase();
};

const disconnectTestDB = async () => {
  await mongoose.connection.close();
};

module.exports = {
  clearDatabase,
  createTestUser,
  createAdminUser,
  createOwnerUser,
  getAuthHeader,
  connectTestDB,
  disconnectTestDB,
  clearTestDB,
  createUserAndToken,
};