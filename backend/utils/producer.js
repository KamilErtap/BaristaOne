const { getRabbitChannel } = require('../config/rabbitmq');
const logger = require('./logger');

const publishToQueue = async (queueName, payload) => {
  try {
    const channel = await getRabbitChannel();

    await channel.assertQueue(queueName, {
      durable: true,
    });

    channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify(payload)),
      {
        persistent: true,
      }
    );

    logger.info(`Mesaj kuyruğa gönderildi: ${queueName}`);
  } catch (error) {
    logger.error(`Mesaj kuyruğa gönderilemedi (${queueName}): ${error.message}`);
    throw error;
  }
};

module.exports = {
  publishToQueue,
};