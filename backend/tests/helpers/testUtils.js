const mongoose = require('mongoose');
const User = require('../../models/User');
const MenuItem = require('../../models/MenuItem');
const Order = require('../../models/Order');
const Category = require('../../models/Category');
const Table = require('../../models/Table');
const generateToken = require('../../utils/generateToken');

const clearDatabase = async () => {
  await User.deleteMany();
  await MenuItem.deleteMany();
  await Order.deleteMany();
  await Category.deleteMany();
  await Table.deleteMany();
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
  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(process.env.MONGO_URI);
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
};