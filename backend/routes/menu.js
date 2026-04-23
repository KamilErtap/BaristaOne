const express = require('express');
const router = express.Router();

const {
  getMenuItems,
  getMenuCategories,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');

const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const validate = require('../middleware/validateMiddleware');
const { menuItemValidator } = require('../validators/menuValidator');

router.get('/', getMenuItems);
router.get('/categories', getMenuCategories);
router.get('/:id', getMenuItemById);

router.post('/', protect, adminOnly, menuItemValidator, validate, createMenuItem);
router.put('/:id', protect, adminOnly, menuItemValidator, validate, updateMenuItem);
router.delete('/:id', protect, adminOnly, deleteMenuItem);

module.exports = router;