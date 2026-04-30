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
    if (!env.rabbitmqEnabled) {
      logger.info('Order created worker devre dışı: RABBITMQ_ENABLED=false');
      process.exit(0);
    }

    await connectDB();

    const isConsuming = await consumeQueue(
      QUEUES.ORDER_CREATED,
      handleOrderCreated
    );

    if (!isConsuming) {
      logger.error('Order created worker kuyruğu dinlemeye başlayamadı');
      process.exit(1);
    }
  } catch (error) {
    logger.error(`Order created worker başlatılamadı: ${error.message}`);
    process.exit(1);
  }
};

const shutdown = async () => {
  try {
    await mongoose.connection.close();
  } catch (error) {
    logger.error(`Worker kapanırken MongoDB hatası: ${error.message}`);
  } finally {
    process.exit(0);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startWorker();