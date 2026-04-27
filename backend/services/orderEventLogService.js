const OrderEventLog = require('../models/OrderEventLog');
const { SORT_OPTIONS } = require('../constants/sortOptions');

const buildEventLogSort = (sort) => {
  let sortOption = { createdAt: -1 };

  if (sort === SORT_OPTIONS.NEWEST) sortOption = { createdAt: -1 };
  if (sort === SORT_OPTIONS.OLDEST) sortOption = { createdAt: 1 };

  return sortOption;
};

const getAllOrderEventLogsService = async (query = {}) => {
  const { eventType, orderId, tableNumber, sort } = query;

  const filter = {};

  if (eventType) {
    filter.eventType = eventType;
  }

  if (orderId) {
    filter.orderId = orderId;
  }

  if (tableNumber) {
    filter.tableNumber = Number(tableNumber);
  }

  const sortOption = buildEventLogSort(sort);

  const logs = await OrderEventLog.find(filter)
    .populate('orderId', '_id tableNumber totalPrice orderStatus createdAt')
    .populate('customerId', 'name email role')
    .sort(sortOption);

  return logs;
};

module.exports = {
  getAllOrderEventLogsService,
};