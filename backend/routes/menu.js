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

router.get('/', getMenuItems);
router.get('/categories', getMenuCategories);
router.get('/:id', getMenuItemById);
router.post('/', protect, adminOnly, createMenuItem);
router.put('/:id', protect, adminOnly, updateMenuItem);
router.delete('/:id', protect, adminOnly, deleteMenuItem);

module.exports = router;