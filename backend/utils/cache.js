const redisClient = require('../config/redis');
const env = require('../config/env');
const logger = require('./logger');

const isCacheEnabled = () => {
  return env.cacheEnabled && process.env.NODE_ENV !== 'test';
};

const getCache = async (key) => {
  if (!isCacheEnabled()) return null;

  try {
    if (!redisClient.isOpen) return null;

    const cachedData = await redisClient.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    logger.error(`Cache okuma hatası (${key}): ${error.message}`);
    return null;
  }
};

const setCache = async (key, value, ttl = 60) => {
  if (!isCacheEnabled()) return false;

  try {
    if (!redisClient.isOpen) return false;

    await redisClient.set(key, JSON.stringify(value), {
      EX: ttl,
    });

    return true;
  } catch (error) {
    logger.error(`Cache yazma hatası (${key}): ${error.message}`);
    return false;
  }
};

const deleteCache = async (key) => {
  if (!isCacheEnabled()) return false;

  try {
    if (!redisClient.isOpen) return false;

    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error(`Cache silme hatası (${key}): ${error.message}`);
    return false;
  }
};

const deleteCacheByPattern = async (pattern) => {
  if (!isCacheEnabled()) return false;

  try {
    if (!redisClient.isOpen) return false;

    let cursor = '0';

    do {
      const result = await redisClient.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });

      cursor = result.cursor;

      if (result.keys.length > 0) {
        await redisClient.del(result.keys);
      }
    } while (cursor !== '0');

    return true;
  } catch (error) {
    logger.error(`Pattern cache silme hatası (${pattern}): ${error.message}`);
    return false;
  }
};

module.exports = {
  getCache,
  setCache,
  deleteCache,
  deleteCacheByPattern,
};