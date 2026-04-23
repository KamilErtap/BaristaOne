const MenuItem = require('../models/MenuItem');

const buildMenuFilters = (query) => {
  const { category, search, available } = query;

  const filter = {};

  if (category) {
    filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
  }

  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  if (available === 'true') {
    filter.isAvailable = true;
  }

  if (available === 'false') {
    filter.isAvailable = false;
  }

  return filter;
};

const buildMenuSort = (sort) => {
  let sortOption = { createdAt: -1 };

  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'name_asc') sortOption = { name: 1 };
  if (sort === 'name_desc') sortOption = { name: -1 };
  if (sort === 'newest') sortOption = { createdAt: -1 };
  if (sort === 'oldest') sortOption = { createdAt: 1 };

  return sortOption;
};

const getAllMenuItems = async (query) => {
  const filter = buildMenuFilters(query);
  const sortOption = buildMenuSort(query.sort);

  const items = await MenuItem.find(filter).sort(sortOption);
  return items;
};

const getAllCategories = async () => {
  return await MenuItem.distinct('category');
};

const getMenuItemOrThrow = async (id) => {
  const item = await MenuItem.findById(id);

  if (!item) {
    const error = new Error('Ürün bulunamadı');
    error.statusCode = 404;
    throw error;
  }

  return item;
};

const createMenuItemService = async (payload) => {
  const {
    name,
    description,
    price,
    category,
    image,
    isAvailable,
  } = payload;

  const newItem = await MenuItem.create({
    name,
    description,
    price,
    category,
    image,
    isAvailable,
  });

  return newItem;
};

const updateMenuItemService = async (id, payload) => {
  const item = await getMenuItemOrThrow(id);

  item.name = payload.name ?? item.name;
  item.description = payload.description ?? item.description;
  item.price = payload.price ?? item.price;
  item.category = payload.category ?? item.category;
  item.image = payload.image ?? item.image;
  item.isAvailable = payload.isAvailable ?? item.isAvailable;

  return await item.save();
};

const deleteMenuItemService = async (id) => {
  const item = await getMenuItemOrThrow(id);
  await item.deleteOne();
  return { deletedId: id };
};

module.exports = {
  getAllMenuItems,
  getAllCategories,
  getMenuItemOrThrow,
  createMenuItemService,
  updateMenuItemService,
  deleteMenuItemService,
};