const express = require('express');
const router = express.Router();

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const validate = require('../middleware/validateMiddleware');
const { categoryValidator } = require('../validators/categoryValidator');

router.get('/', getCategories);
router.get('/:id', getCategoryById);

router.post('/', protect, adminOnly, categoryValidator, validate, createCategory);
router.put('/:id', protect, adminOnly, categoryValidator, validate, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;