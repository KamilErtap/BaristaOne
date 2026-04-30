const amqp = require('amqplib');
const env = require('./env');
const logger = require('../utils/logger');

let connection = null;
let channel = null;
let connectingPromise = null;

const MAX_RETRIES = 5;
const BASE_RETRY_DELAY_MS = 1000;

const isRabbitEnabled = () => {
  return env.rabbitmqEnabled && process.env.NODE_ENV !== 'test';
};

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
  if (!isRabbitEnabled()) {
    logger.info('RabbitMQ devre dışı');
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

  logger.error(`RabbitMQ bağlantısı kurulamadı: ${lastError?.message}`);
  return null;
};

const getRabbitChannel = async () => {
  if (!isRabbitEnabled()) {
    return null;
  }

  if (channel) {
    return channel;
  }

  if (!connectingPromise) {
    connectingPromise = createRabbitConnection()
      .catch((error) => {
        resetRabbitState();
        logger.error(`RabbitMQ beklenmeyen bağlantı hatası: ${error.message}`);
        return null;
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