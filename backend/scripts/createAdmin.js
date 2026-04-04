const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (existingAdmin) {
      console.log('Admin zaten mevcut');
      process.exit();
    }

    const admin = await User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
    });

    console.log('Admin oluşturuldu:', admin.email);
    process.exit();
  } catch (error) {
    console.error('Admin oluşturulamadı:', error.message);
    process.exit(1);
  }
};

createAdmin();