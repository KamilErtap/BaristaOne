const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const { getAllOrderEventLogsService } = require('../services/orderEventLogService');

const getOrderEventLogs = asyncHandler(async (req, res) => {
  const logs = await getAllOrderEventLogsService(req.query);

  return sendSuccess(res, 200, 'Sipariş event logları getirildi', {
    logs,
  });
});

module.exports = {
  getOrderEventLogs,
};