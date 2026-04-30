const { createClient } = require('redis');
const env = require('./env');
const logger = require('../utils/logger');

let redisClient = null;

const isRedisEnabled = () => {
  return env.cacheEnabled && env.redisUrl;
};

const getRedisClient = () => {
  if (!isRedisEnabled()) {
    return null;
  }

  if (redisClient) {
    return redisClient;
  }

  redisClient = createClient({
    url: env.redisUrl,
  });

  redisClient.on('error', (error) => {
    logger.error(`Redis bağlantı hatası: ${error.message}`);
  });

  redisClient.on('connect', () => {
    logger.info('Redis bağlantısı kuruluyor');
  });

  redisClient.on('ready', () => {
    logger.info('Redis hazır');
  });

  redisClient.on('end', () => {
    logger.error('Redis bağlantısı kapandı');
  });

  return redisClient;
};

const connectRedis = async () => {
  if (!isRedisEnabled()) {
    logger.info('Redis cache devre dışı');
    return null;
  }

  const client = getRedisClient();

  if (!client) {
    return null;
  }

  try {
    if (!client.isOpen) {
      await client.connect();
    }

    return client;
  } catch (error) {
    logger.error(`Redis bağlantısı kurulamadı: ${error.message}`);
    return null;
  }
};

const closeRedis = async () => {
  if (!redisClient) {
    return;
  }

  try {
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
  } catch (error) {
    logger.error(`Redis bağlantısı kapatılırken hata: ${error.message}`);
  } finally {
    redisClient = null;
  }
};

module.exports = {
  getRedisClient,
  connectRedis,
  closeRedis,
};