const env = require('../config/env');
const { getRabbitChannel } = require('../config/rabbitmq');
const logger = require('./logger');

const isRabbitConsumerEnabled = () => {
  return env.rabbitmqEnabled && process.env.NODE_ENV !== 'test';
};

const consumeQueue = async (queueName, handler) => {
  if (!isRabbitConsumerEnabled()) {
    logger.info(`RabbitMQ consumer devre dışı (${queueName})`);
    return false;
  }

  try {
    const channel = await getRabbitChannel();

    if (!channel) {
      logger.error(`RabbitMQ channel bulunamadı (${queueName})`);
      return false;
    }

    await channel.assertQueue(queueName, {
      durable: true,
    });

    await channel.prefetch(1);

    await channel.consume(queueName, async (message) => {
      if (!message) return;

      try {
        const payload = JSON.parse(message.content.toString());

        await handler(payload);

        channel.ack(message);
      } catch (error) {
        logger.error(
          `Kuyruk mesajı işlenemedi (${queueName}): ${error.message}`
        );

        channel.nack(message, false, false);
      }
    });

    logger.info(`Kuyruk dinleniyor (${queueName})`);
    return true;
  } catch (error) {
    logger.error(`Kuyruk dinlenemedi (${queueName}): ${error.message}`);
    return false;
  }
};

module.exports = consumeQueue;
module.exports.consumeQueue = consumeQueue;