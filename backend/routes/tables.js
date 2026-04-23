const express = require('express');
const router = express.Router();

const {
  getTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
} = require('../controllers/tableController');

const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const validate = require('../middleware/validateMiddleware');
const { tableValidator } = require('../validators/tableValidator');

router.get('/', getTables);
router.get('/:id', getTableById);

router.post('/', protect, adminOnly, tableValidator, validate, createTable);
router.put('/:id', protect, adminOnly, tableValidator, validate, updateTable);
router.delete('/:id', protect, adminOnly, deleteTable);

module.exports = router;