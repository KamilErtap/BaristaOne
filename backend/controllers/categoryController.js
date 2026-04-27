const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const { deleteCache, deleteCacheByPattern } = require('../utils/cache');

const {
  getAllCategoriesService,
  getCategoryOrThrow,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} = require('../services/categoryService');

const CATEGORY_CACHE_KEY = 'menu_categories';

const getCategories = asyncHandler(async (req, res) => {
  const categories = await getAllCategoriesService(req.query);

  return sendSuccess(res, 200, 'Kategoriler getirildi', {
    categories,
  });
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await getCategoryOrThrow(req.params.id);

  return sendSuccess(res, 200, 'Kategori getirildi', {
    category,
  });
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await createCategoryService(req.body);

  await deleteCache(CATEGORY_CACHE_KEY);
  await deleteCacheByPattern('menu_items:*');

  return sendSuccess(res, 201, 'Kategori başarıyla eklendi', {
    category,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await updateCategoryService(req.params.id, req.body);

  await deleteCache(CATEGORY_CACHE_KEY);
  await deleteCacheByPattern('menu_items:*');

  return sendSuccess(res, 200, 'Kategori başarıyla güncellendi', {
    category,
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const result = await deleteCategoryService(req.params.id);

  await deleteCache(CATEGORY_CACHE_KEY);
  await deleteCacheByPattern('menu_items:*');

  return sendSuccess(res, 200, 'Kategori başarıyla silindi', result);
});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};