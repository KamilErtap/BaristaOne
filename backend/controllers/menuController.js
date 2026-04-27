const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const {
  getCache,
  setCache,
  deleteCache,
  deleteCacheByPattern,
} = require('../utils/cache');

const {
  getAllMenuItems,
  getAllCategories,
  getMenuItemOrThrow,
  createMenuItemService,
  updateMenuItemService,
  deleteMenuItemService,
} = require('../services/menuService');

const buildMenuCacheKey = (query = {}) => {
  const params = new URLSearchParams(query).toString();
  return params ? `menu_items:${params}` : 'menu_items:all';
};

const MENU_CACHE_TTL = 60;
const CATEGORY_CACHE_KEY = 'menu_categories';
const CATEGORY_CACHE_TTL = 300;

const getMenuItems = asyncHandler(async (req, res) => {
  const cacheKey = buildMenuCacheKey(req.query);

  const cachedItems = await getCache(cacheKey);

  if (cachedItems) {
    return sendSuccess(res, 200, 'Menü ürünleri cache üzerinden getirildi', {
      items: cachedItems,
    });
  }

  const items = await getAllMenuItems(req.query);

  await setCache(cacheKey, items, MENU_CACHE_TTL);

  return sendSuccess(res, 200, 'Menü ürünleri getirildi', {
    items,
  });
});

const getMenuCategories = asyncHandler(async (req, res) => {
  const cachedCategories = await getCache(CATEGORY_CACHE_KEY);

  if (cachedCategories) {
    return sendSuccess(res, 200, 'Kategoriler cache üzerinden getirildi', {
      categories: cachedCategories,
    });
  }

  const categories = await getAllCategories();

  await setCache(CATEGORY_CACHE_KEY, categories, CATEGORY_CACHE_TTL);

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

  await deleteCacheByPattern('menu_items:*');
  await deleteCache(CATEGORY_CACHE_KEY);

  return sendSuccess(res, 201, 'Ürün başarıyla eklendi', {
    item,
  });
});

const updateMenuItem = asyncHandler(async (req, res) => {
  const item = await updateMenuItemService(req.params.id, req.body);

  await deleteCacheByPattern('menu_items:*');
  await deleteCache(CATEGORY_CACHE_KEY);

  return sendSuccess(res, 200, 'Ürün başarıyla güncellendi', {
    item,
  });
});

const deleteMenuItem = asyncHandler(async (req, res) => {
  const result = await deleteMenuItemService(req.params.id);

  await deleteCacheByPattern('menu_items:*');
  await deleteCache(CATEGORY_CACHE_KEY);

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