const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({
    message: 'Bu işlem için admin yetkisi gerekli',
  });
};

module.exports = adminOnly;