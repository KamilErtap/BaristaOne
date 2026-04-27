const express = require('express');
const { getOrderEventLogs } = require('../controllers/orderEventLogController');
const protect = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');
const ROLES = require('../constants/roles');

const router = express.Router();

router.get(
  '/',
  protect,
  allowRoles(ROLES.ADMIN, ROLES.OWNER),
  getOrderEventLogs
);

module.exports = router;