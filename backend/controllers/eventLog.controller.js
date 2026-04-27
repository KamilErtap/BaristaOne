const OrderEventLog = require('../models/OrderEventLog');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Order event loglarını listele
 * @route   GET /api/event-logs
 * @access  Admin / Owner
 */
const getOrderEventLogs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    eventType,
    status,
    orderId,
  } = req.query;

  const query = {};

  if (eventType) {
    query.eventType = eventType;
  }

  if (status) {
    query.status = status;
  }

  if (orderId) {
    query.orderId = orderId;
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [logs, total] = await Promise.all([
    OrderEventLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    OrderEventLog.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: logs.length,
    total,
    page: pageNumber,
    pages: Math.ceil(total / limitNumber),
    data: logs,
  });
});

module.exports = {
  getOrderEventLogs,
};