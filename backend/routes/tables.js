const express = require('express');
const router = express.Router();

const {
  getTables,
  getTableById,
  getTableByCode,
  createTable,
  updateTable,
  deleteTable,
} = require('../controllers/tableController');

const protect = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');
const ROLES = require('../constants/roles');
const validate = require('../middleware/validateMiddleware');
const { tableValidator } = require('../validators/tableValidator');

router.get('/', getTables);
router.get('/code/:code', getTableByCode);
router.get('/:id', getTableById);

router.post(
  '/',
  protect,
  allowRoles(ROLES.ADMIN, ROLES.OWNER),
  tableValidator,
  validate,
  createTable
);

router.put(
  '/:id',
  protect,
  allowRoles(ROLES.ADMIN, ROLES.OWNER),
  tableValidator,
  validate,
  updateTable
);

router.delete(
  '/:id',
  protect,
  allowRoles(ROLES.ADMIN, ROLES.OWNER),
  deleteTable
);

module.exports = router;