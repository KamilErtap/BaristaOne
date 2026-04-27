const { redisClient } = require('../config/redis');
const logger = require('./logger');

const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  } catch (error) {
    logger.error(`Cache okuma hatası (${key}): ${error.message}`);
    return null;
  }
};

const setCache = async (key, value, ttlInSeconds = 60) => {
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttlInSeconds,
    });
  } catch (error) {
    logger.error(`Cache yazma hatası (${key}): ${error.message}`);
  }
};

const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.error(`Cache silme hatası (${key}): ${error.message}`);
  }
};

const deleteCacheByPattern = async (pattern) => {
  try {
    const keys = await redisClient.keys(pattern);

    if (!keys.length) {
      return;
    }

    await redisClient.del(keys);
  } catch (error) {
    logger.error(`Pattern cache silme hatası (${pattern}): ${error.message}`);
  }
};

module.exports = {
  getCache,
  setCache,
  deleteCache,
  deleteCacheByPattern,
};