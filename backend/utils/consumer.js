const { getRabbitChannel } = require('../config/rabbitmq');
const logger = require('./logger');

const consumeQueue = async (queueName, handler) => {
  try {
    const channel = await getRabbitChannel();

    await channel.assertQueue(queueName, {
      durable: true,
    });

    logger.info(`Queue dinleniyor: ${queueName}`);

    channel.consume(queueName, async (message) => {
      if (!message) {
        return;
      }

      try {
        const content = JSON.parse(message.content.toString());

        await handler(content);

        channel.ack(message);
      } catch (error) {
        logger.error(`Queue işleme hatası (${queueName}): ${error.message}`);
        channel.nack(message, false, false);
      }
    });
  } catch (error) {
    logger.error(`Queue dinlenemedi (${queueName}): ${error.message}`);
    throw error;
  }
};

module.exports = {
  consumeQueue,
};