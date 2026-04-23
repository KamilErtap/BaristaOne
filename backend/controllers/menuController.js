const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

const {
  getAllMenuItems,
  getAllCategories,
  getMenuItemOrThrow,
  createMenuItemService,
  updateMenuItemService,
  deleteMenuItemService,
} = require('../services/menuService');

const getMenuItems = asyncHandler(async (req, res) => {
  const items = await getAllMenuItems(req.query);

  return sendSuccess(res, 200, 'Menü ürünleri getirildi', {
    items,
  });
});

const getMenuCategories = asyncHandler(async (req, res) => {
  const categories = await getAllCategories();

  return sendSuccess(res, 200, 'Kategoriler getirildi', {
    categories,
  });
});

const getMenuItemById = asyncHandler(async (req, res) => {
  const item = await getMenuItemOrThrow(req.params.id);

  return sendSuccess(res, 200, 'Ürün getirildi', {
    item,
  });
});

const createMenuItem = asyncHandler(async (req, res) => {
  const item = await createMenuItemService(req.body);

  return sendSuccess(res, 201, 'Ürün başarıyla eklendi', {
    item,
  });
});

const updateMenuItem = asyncHandler(async (req, res) => {
  const item = await updateMenuItemService(req.params.id, req.body);

  return sendSuccess(res, 200, 'Ürün başarıyla güncellendi', {
    item,
  });
});

const deleteMenuItem = asyncHandler(async (req, res) => {
  const result = await deleteMenuItemService(req.params.id);

  return sendSuccess(res, 200, 'Ürün başarıyla silindi', result);
});

module.exports = {
  getMenuItems,
  getMenuCategories,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};