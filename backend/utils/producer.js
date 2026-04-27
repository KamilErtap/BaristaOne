const { getRabbitChannel } = require('../config/rabbitmq');
const logger = require('./logger');

const publishToQueue = async (queueName, payload) => {
  if (process.env.NODE_ENV === 'test') {
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

    const isPublished = channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify(payload)),
      {
        persistent: true,
      }
    );

    if (!isPublished) {
      logger.error(`Mesaj kuyruğa yazılamadı (${queueName})`);
      return false;
    }

    logger.info(`Mesaj kuyruğa gönderildi (${queueName})`);
    return true;
  } catch (error) {
    logger.error(
      `Mesaj kuyruğa gönderilemedi (${queueName}): ${error.message}`
    );

    return false;
  }
};

module.exports = {
  publishToQueue,
};