const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

const {
  getAllTablesService,
  getTableOrThrow,
  createTableService,
  updateTableService,
  deleteTableService,
} = require('../services/tableService');

const getTables = asyncHandler(async (req, res) => {
  const tables = await getAllTablesService(req.query);

  return sendSuccess(res, 200, 'Masalar getirildi', {
    tables,
  });
});

const getTableById = asyncHandler(async (req, res) => {
  const table = await getTableOrThrow(req.params.id);

  return sendSuccess(res, 200, 'Masa getirildi', {
    table,
  });
});

const createTable = asyncHandler(async (req, res) => {
  const table = await createTableService(req.body);

  return sendSuccess(res, 201, 'Masa başarıyla eklendi', {
    table,
  });
});

const updateTable = asyncHandler(async (req, res) => {
  const table = await updateTableService(req.params.id, req.body);

  return sendSuccess(res, 200, 'Masa başarıyla güncellendi', {
    table,
  });
});

const deleteTable = asyncHandler(async (req, res) => {
  const result = await deleteTableService(req.params.id);

  return sendSuccess(res, 200, 'Masa başarıyla silindi', result);
});

module.exports = {
  getTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
};