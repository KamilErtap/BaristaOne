const connectDB = require('../config/db');
const env = require('../config/env');
const logger = require('../utils/logger');
const User = require('../models/User');
const ROLES = require('../constants/roles');

const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({
      email: env.adminEmail.toLowerCase(),
    });

    if (existingAdmin) {
      logger.warn('Admin zaten mevcut');
      process.exit(0);
    }

    const admin = await User.create({
      name: env.adminName,
      email: env.adminEmail.toLowerCase(),
      password: env.adminPassword,
      role: ROLES.ADMIN,
    });

    logger.info(`Admin oluşturuldu: ${admin.email}`);
    process.exit(0);
  } catch (error) {
    logger.error(`Admin oluşturulamadı: ${error.message}`);
    process.exit(1);
  }
};

createAdmin();