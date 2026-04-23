const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const categoryRoutes = require('./routes/categories');
const tableRoutes = require('./routes/tables');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.json({ message: 'Cafe Automation API çalışıyor' });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API ayakta' });
});

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tables', tableRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;