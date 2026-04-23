const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const { getSummaryReportService } = require('../services/reportService');

const getSummaryReport = asyncHandler(async (req, res) => {
  const report = await getSummaryReportService();

  return sendSuccess(res, 200, 'Rapor özeti getirildi', report);
});

module.exports = {
  getSummaryReport,
};