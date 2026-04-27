const amqp = require('amqplib');
const env = require('./env');
const logger = require('../utils/logger');

let connection = null;
let channel = null;
let connectingPromise = null;

const MAX_RETRIES = 5;
const BASE_RETRY_DELAY_MS = 1000;

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getRetryDelay = (attempt) => {
  return BASE_RETRY_DELAY_MS * attempt;
};

const resetRabbitState = () => {
  connection = null;
  channel = null;
  connectingPromise = null;
};

const attachConnectionListeners = (rabbitConnection) => {
  rabbitConnection.on('error', (error) => {
    logger.error(`RabbitMQ bağlantı hatası: ${error.message}`);
    resetRabbitState();
  });

  rabbitConnection.on('close', () => {
    logger.error('RabbitMQ bağlantısı kapandı');
    resetRabbitState();
  });
};

const createRabbitConnection = async () => {
  if (process.env.NODE_ENV === 'test') {
    return null;
  }

  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      logger.info(`RabbitMQ bağlantısı deneniyor (${attempt}/${MAX_RETRIES})`);

      connection = await amqp.connect(env.rabbitmqUrl);
      attachConnectionListeners(connection);

      channel = await connection.createChannel();

      logger.info('RabbitMQ bağlantısı kuruldu');

      return channel;
    } catch (error) {
      lastError = error;

      logger.error(
        `RabbitMQ bağlantı denemesi başarısız (${attempt}/${MAX_RETRIES}): ${error.message}`
      );

      connection = null;
      channel = null;

      if (attempt < MAX_RETRIES) {
        await sleep(getRetryDelay(attempt));
      }
    }
  }

  throw lastError;
};

const getRabbitChannel = async () => {
  if (process.env.NODE_ENV === 'test') {
    return null;
  }

  if (channel) {
    return channel;
  }

  if (!connectingPromise) {
    connectingPromise = createRabbitConnection()
      .catch((error) => {
        resetRabbitState();
        throw error;
      })
      .finally(() => {
        connectingPromise = null;
      });
  }

  return connectingPromise;
};

const closeRabbitConnection = async () => {
  try {
    if (channel) {
      await channel.close();
    }

    if (connection) {
      await connection.close();
    }
  } catch (error) {
    logger.error(`RabbitMQ bağlantısı kapatılırken hata: ${error.message}`);
  } finally {
    resetRabbitState();
  }
};

module.exports = {
  getRabbitChannel,
  closeRabbitConnection,
};