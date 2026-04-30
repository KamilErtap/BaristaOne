const { getRedisClient } = require('../config/redis');
const env = require('../config/env');
const logger = require('./logger');

const isCacheEnabled = () => {
  return env.cacheEnabled && process.env.NODE_ENV !== 'test';
};

const getActiveRedisClient = () => {
  if (!isCacheEnabled()) {
    return null;
  }

  const client = getRedisClient();

  if (!client || !client.isOpen) {
    return null;
  }

  return client;
};

const getCache = async (key) => {
  const client = getActiveRedisClient();
  if (!client) return null;

  try {
    const cachedData = await client.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    logger.error(`Cache okuma hatası (${key}): ${error.message}`);
    return null;
  }
};

const setCache = async (key, value, ttl = 60) => {
  const client = getActiveRedisClient();
  if (!client) return false;

  try {
    await client.set(key, JSON.stringify(value), {
      EX: ttl,
    });

    return true;
  } catch (error) {
    logger.error(`Cache yazma hatası (${key}): ${error.message}`);
    return false;
  }
};

const deleteCache = async (key) => {
  const client = getActiveRedisClient();
  if (!client) return false;

  try {
    await client.del(key);
    return true;
  } catch (error) {
    logger.error(`Cache silme hatası (${key}): ${error.message}`);
    return false;
  }
};

const deleteCacheByPattern = async (pattern) => {
  const client = getActiveRedisClient();
  if (!client) return false;

  try {
    let cursor = 0;

    do {
      const result = await client.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });

      cursor = Number(result.cursor);

      if (result.keys.length > 0) {
        await client.del(result.keys);
      }
    } while (cursor !== 0);

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