const Category = require('../models/Category');
const { SORT_OPTIONS } = require('../constants/sortOptions');

const buildCategorySort = (sort) => {
  let sortOption = { createdAt: -1 };

  if (sort === SORT_OPTIONS.NAME_ASC) sortOption = { name: 1 };
  if (sort === SORT_OPTIONS.NAME_DESC) sortOption = { name: -1 };
  if (sort === SORT_OPTIONS.NEWEST) sortOption = { createdAt: -1 };
  if (sort === SORT_OPTIONS.OLDEST) sortOption = { createdAt: 1 };

  return sortOption;
};

const getCategoryOrThrow = async (id) => {
  const category = await Category.findById(id);

  if (!category) {
    const error = new Error('Kategori bulunamadı');
    error.statusCode = 404;
    throw error;
  }

  return category;
};

const getAllCategoriesService = async (query = {}) => {
  const { search, sort, isActive } = query;

  const filter = {};

  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  if (isActive === 'true') filter.isActive = true;
  if (isActive === 'false') filter.isActive = false;

  const sortOption = buildCategorySort(sort);

  return await Category.find(filter).sort(sortOption);
};

const createCategoryService = async ({ name, description, isActive }) => {
  const existing = await Category.findOne({
    name: { $regex: new RegExp(`^${name}$`, 'i') },
  });

  if (existing) {
    const error = new Error('Bu kategori zaten mevcut');
    error.statusCode = 400;
    throw error;
  }

  return await Category.create({
    name,
    description,
    isActive,
  });
};

const updateCategoryService = async (id, payload) => {
  const category = await getCategoryOrThrow(id);

  if (
    payload.name &&
    payload.name.toLowerCase() !== category.name.toLowerCase()
  ) {
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${payload.name}$`, 'i') },
    });

    if (existing) {
      const error = new Error('Bu kategori zaten mevcut');
      error.statusCode = 400;
      throw error;
    }
  }

  category.name = payload.name ?? category.name;
  category.description = payload.description ?? category.description;
  category.isActive = payload.isActive ?? category.isActive;

  return await category.save();
};

const deleteCategoryService = async (id) => {
  const category = await getCategoryOrThrow(id);
  await category.deleteOne();
  return { deletedId: id };
};

module.exports = {
  getAllCategoriesService,
  getCategoryOrThrow,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
};