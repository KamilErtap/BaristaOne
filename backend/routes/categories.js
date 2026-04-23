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
const allowRoles = require('../middleware/roleMiddleware');
const ROLES = require('../constants/roles');
const validate = require('../middleware/validateMiddleware');
const { categoryValidator } = require('../validators/categoryValidator');

router.get('/', getCategories);
router.get('/:id', getCategoryById);

router.post(
  '/',
  protect,
  allowRoles(ROLES.ADMIN, ROLES.OWNER),
  categoryValidator,
  validate,
  createCategory
);

router.put(
  '/:id',
  protect,
  allowRoles(ROLES.ADMIN, ROLES.OWNER),
  categoryValidator,
  validate,
  updateCategory
);

router.delete(
  '/:id',
  protect,
  allowRoles(ROLES.ADMIN, ROLES.OWNER),
  deleteCategory
);

module.exports = router;