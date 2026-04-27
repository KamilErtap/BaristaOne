const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const env = require('./config/env');

const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const categoryRoutes = require('./routes/categories');
const tableRoutes = require('./routes/tables');
const reportRoutes = require('./routes/reports');
const eventLogRoutes = require('./routes/eventLog.routes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

const morganMode = env.nodeEnv === 'production' ? 'combined' : 'dev';

const allowedOrigins = [
  'http://localhost:5173',
  'https://barista-one-frontend.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('CORS origin izinli değil'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.options('*', cors());
app.use(morgan(morganMode));
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
app.use('/api/reports', reportRoutes);
app.use('/api/event-logs', eventLogRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;