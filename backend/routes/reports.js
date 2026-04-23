const express = require('express');
const router = express.Router();

const { getSummaryReport } = require('../controllers/reportController');
const protect = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');
const ROLES = require('../constants/roles');

router.get(
  '/summary',
  protect,
  allowRoles(ROLES.OWNER, ROLES.ADMIN),
  getSummaryReport
);

module.exports = router;