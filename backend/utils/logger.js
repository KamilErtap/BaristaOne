const env = require('../config/env');

const formatMessage = (level, message) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
};

const logger = {
  info(message) {
    console.log(formatMessage('info', message));
  },

  warn(message) {
    console.warn(formatMessage('warn', message));
  },

  error(message) {
    console.error(formatMessage('error', message));
  },

  debug(message) {
    if (env.nodeEnv !== 'production') {
      console.log(formatMessage('debug', message));
    }
  },
};

module.exports = logger;