const amqp = require('amqplib');
const env = require('./env');
const logger = require('../utils/logger');

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
  try {
    if (connection && channel) {
      return { connection, channel };
    }

    connection = await amqp.connect(env.rabbitmqUrl);
    channel = await connection.createChannel();

    logger.info('RabbitMQ bağlandı');

    connection.on('error', (error) => {
      logger.error(`RabbitMQ bağlantı hatası: ${error.message}`);
    });

    connection.on('close', () => {
      logger.warn('RabbitMQ bağlantısı kapandı');
      connection = null;
      channel = null;
    });

    return { connection, channel };
  } catch (error) {
    logger.error(`RabbitMQ bağlantı kurulamadı: ${error.message}`);
    throw error;
  }
};

const getRabbitChannel = async () => {
  if (!channel) {
    await connectRabbitMQ();
  }

  return channel;
};

module.exports = {
  connectRabbitMQ,
  getRabbitChannel,
};