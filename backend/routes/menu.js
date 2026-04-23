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
const allowRoles = require('../middleware/roleMiddleware');
const ROLES = require('../constants/roles');
const validate = require('../middleware/validateMiddleware');
const { menuItemValidator } = require('../validators/menuValidator');

router.get('/', getMenuItems);
router.get('/categories', getMenuCategories);
router.get('/:id', getMenuItemById);

router.post(
  '/',
  protect,
  allowRoles(ROLES.ADMIN, ROLES.OWNER),
  menuItemValidator,
  validate,
  createMenuItem
);

router.put(
  '/:id',
  protect,
  allowRoles(ROLES.ADMIN, ROLES.OWNER),
  menuItemValidator,
  validate,
  updateMenuItem
);

router.delete(
  '/:id',
  protect,
  allowRoles(ROLES.ADMIN, ROLES.OWNER),
  deleteMenuItem
);

module.exports = router;