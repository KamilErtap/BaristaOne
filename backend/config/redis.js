const { createClient } = require('redis');
const env = require('./env');
const logger = require('../utils/logger');

const redisClient = createClient({
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

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

module.exports = {
  redisClient,
  connectRedis,
};