const MenuItem = require('../models/MenuItem');

const getMenuItems = async (req, res, next) => {
  try {
    const { category, search, sort, available } = req.query;

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

    let sortOption = { createdAt: -1 };

    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'name_asc') sortOption = { name: 1 };
    if (sort === 'name_desc') sortOption = { name: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    const items = await MenuItem.find(filter).sort(sortOption);

    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};

const getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error('Ürün bulunamadı');
    }

    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

const createMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, category, image, isAvailable } = req.body;

    if (!name || price === undefined || !category) {
      res.status(400);
      throw new Error('Ad, fiyat ve kategori zorunlu');
    }

    const newItem = await MenuItem.create({
      name,
      description,
      price,
      category,
      image,
      isAvailable,
    });

    res.status(201).json({
      message: 'Ürün başarıyla eklendi',
      item: newItem,
    });
  } catch (error) {
    next(error);
  }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error('Ürün bulunamadı');
    }

    item.name = req.body.name ?? item.name;
    item.description = req.body.description ?? item.description;
    item.price = req.body.price ?? item.price;
    item.category = req.body.category ?? item.category;
    item.image = req.body.image ?? item.image;
    item.isAvailable = req.body.isAvailable ?? item.isAvailable;

    const updatedItem = await item.save();

    res.status(200).json({
      message: 'Ürün başarıyla güncellendi',
      item: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error('Ürün bulunamadı');
    }

    await item.deleteOne();

    res.status(200).json({
      message: 'Ürün başarıyla silindi',
    });
  } catch (error) {
    next(error);
  }
};

const getMenuCategories = async (req, res, next) => {
  try {
    const categories = await MenuItem.distinct('category');

    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuCategories,
};