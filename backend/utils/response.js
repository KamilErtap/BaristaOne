const sendSuccess = (res, statusCode = 200, message = 'İşlem başarılı', data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, statusCode = 500, message = 'Sunucu hatası') => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = {
  sendSuccess,
  sendError,
};