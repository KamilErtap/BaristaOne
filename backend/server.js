const app = require('./app');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    await connectDB();
    await connectRedis();
    isConnected = true;
  }

  return app(req, res);
};