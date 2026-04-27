const env = require('../config/env');
const logger = require('../utils/logger');

const notFound = (req, res, next) => {
  const error = new Error(`Bulunamadı: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode =
    err.statusCode ||
    (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  logger.error(
    `${req.method} ${req.originalUrl} -> ${statusCode} - ${err.message || 'Sunucu hatası'}`
  );

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Sunucu hatası',
    ...(env.nodeEnv !== 'production' && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };