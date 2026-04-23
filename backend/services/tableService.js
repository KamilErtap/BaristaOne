const Table = require('../models/Table');

const buildTableSort = (sort) => {
  let sortOption = { number: 1 };

  if (sort === 'number_asc') sortOption = { number: 1 };
  if (sort === 'number_desc') sortOption = { number: -1 };
  if (sort === 'capacity_asc') sortOption = { capacity: 1 };
  if (sort === 'capacity_desc') sortOption = { capacity: -1 };
  if (sort === 'newest') sortOption = { createdAt: -1 };
  if (sort === 'oldest') sortOption = { createdAt: 1 };

  return sortOption;
};

const getTableOrThrow = async (id) => {
  const table = await Table.findById(id);

  if (!table) {
    const error = new Error('Masa bulunamadı');
    error.statusCode = 404;
    throw error;
  }

  return table;
};

const getAllTablesService = async (query = {}) => {
  const { search, sort, isActive } = query;

  const filter = {};

  if (search) {
    const isNumeric = !Number.isNaN(Number(search));

    filter.$or = [
      { code: { $regex: search, $options: 'i' } },
      ...(isNumeric ? [{ number: Number(search) }] : []),
    ];
  }

  if (isActive === 'true') filter.isActive = true;
  if (isActive === 'false') filter.isActive = false;

  const sortOption = buildTableSort(sort);

  return await Table.find(filter).sort(sortOption);
};

const createTableService = async ({ number, code, capacity, isActive, description }) => {
  const existingNumber = await Table.findOne({ number });
  if (existingNumber) {
    const error = new Error('Bu masa numarası zaten mevcut');
    error.statusCode = 400;
    throw error;
  }

  const existingCode = await Table.findOne({
    code: { $regex: new RegExp(`^${code}$`, 'i') },
  });

  if (existingCode) {
    const error = new Error('Bu masa kodu zaten mevcut');
    error.statusCode = 400;
    throw error;
  }

  return await Table.create({
    number,
    code,
    capacity,
    isActive,
    description,
  });
};

const updateTableService = async (id, payload) => {
  const table = await getTableOrThrow(id);

  if (
    payload.number &&
    Number(payload.number) !== table.number
  ) {
    const existingNumber = await Table.findOne({ number: Number(payload.number) });
    if (existingNumber) {
      const error = new Error('Bu masa numarası zaten mevcut');
      error.statusCode = 400;
      throw error;
    }
  }

  if (
    payload.code &&
    payload.code.toLowerCase() !== table.code.toLowerCase()
  ) {
    const existingCode = await Table.findOne({
      code: { $regex: new RegExp(`^${payload.code}$`, 'i') },
    });

    if (existingCode) {
      const error = new Error('Bu masa kodu zaten mevcut');
      error.statusCode = 400;
      throw error;
    }
  }

  table.number = payload.number ?? table.number;
  table.code = payload.code ?? table.code;
  table.capacity = payload.capacity ?? table.capacity;
  table.isActive = payload.isActive ?? table.isActive;
  table.description = payload.description ?? table.description;

  return await table.save();
};

const deleteTableService = async (id) => {
  const table = await getTableOrThrow(id);
  await table.deleteOne();
  return { deletedId: id };
};

const getTableByCodeOrThrow = async (code) => {
  const table = await Table.findOne({
    code: { $regex: new RegExp(`^${code}$`, 'i') },
  });

  if (!table) {
    const error = new Error('Masa bulunamadı');
    error.statusCode = 404;
    throw error;
  }

  if (!table.isActive) {
    const error = new Error('Bu masa şu anda aktif değil');
    error.statusCode = 400;
    throw error;
  }

  return table;
};

module.exports = {
  getAllTablesService,
  getTableOrThrow,
  getTableByCodeOrThrow,
  createTableService,
  updateTableService,
  deleteTableService,
};