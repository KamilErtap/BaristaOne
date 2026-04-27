const mongoose = require('mongoose');
const env = require('../config/env');
const connectDB = require('../config/db');
const consumeQueue = require('../utils/consumer');
const QUEUES = require('../constants/queues');
const EVENT_TYPES = require('../constants/eventTypes');
const OrderEventLog = require('../models/OrderEventLog');
const logger = require('../utils/logger');

const handleOrderCreated = async (payload) => {
  await OrderEventLog.create({
    eventType: EVENT_TYPES.ORDER_CREATED,
    orderId: payload.orderId,
    customerId: payload.customerId,
    tableNumber: payload.tableNumber,
    totalPrice: payload.totalPrice,
    processedAt: new Date(),
  });

  logger.info(`ORDER_CREATED event işlendi: ${payload.orderId}`);
};

const startWorker = async () => {
  try {
    await connectDB();

    await consumeQueue(QUEUES.ORDER_CREATED, handleOrderCreated);
  } catch (error) {
    logger.error(`Order created worker başlatılamadı: ${error.message}`);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

startWorker();