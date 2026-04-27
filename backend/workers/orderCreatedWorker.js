const connectDB = require('../config/db');
const { connectRabbitMQ } = require('../config/rabbitmq');
const { QUEUES } = require('../constants/queues');
const { consumeQueue } = require('../utils/consumer');
const logger = require('../utils/logger');
const OrderEventLog = require('../models/OrderEventLog');

const startOrderCreatedWorker = async () => {
  await connectDB();
  await connectRabbitMQ();

  await consumeQueue(QUEUES.ORDER_CREATED, async (payload) => {
    await OrderEventLog.create({
      orderId: payload.orderId,
      eventType: 'ORDER_CREATED',
      tableNumber: payload.tableNumber,
      customerId: payload.customerId,
      totalPrice: payload.totalPrice,
    });

    logger.info(
      `ORDER_CREATED işlendi ve loglandı | orderId=${payload.orderId} tableNumber=${payload.tableNumber} totalPrice=${payload.totalPrice}`
    );
  });
};

startOrderCreatedWorker().catch((error) => {
  logger.error(`OrderCreatedWorker başlatılamadı: ${error.message}`);
  process.exit(1);
});