const dotenv = require('dotenv');
const connectDB = require('../config/db');
const MenuItem = require('../models/MenuItem');

dotenv.config();

const menuItems = [
  {
    name: 'Espresso',
    description: 'Yoğun aromalı kısa kahve',
    price: 90,
    category: 'Kahve',
    image: '',
    isAvailable: true,
  },
  {
    name: 'Latte',
    description: 'Sütlü kahve',
    price: 120,
    category: 'Kahve',
    image: '',
    isAvailable: true,
  },
  {
    name: 'Cappuccino',
    description: 'Bol köpüklü kahve',
    price: 115,
    category: 'Kahve',
    image: '',
    isAvailable: true,
  },
  {
    name: 'Americano',
    description: 'Espresso bazlı sade kahve',
    price: 100,
    category: 'Kahve',
    image: '',
    isAvailable: true,
  },
  {
    name: 'Cheesecake',
    description: 'Kremamsı tatlı',
    price: 150,
    category: 'Tatlı',
    image: '',
    isAvailable: true,
  },
  {
    name: 'Brownie',
    description: 'Çikolatalı tatlı',
    price: 140,
    category: 'Tatlı',
    image: '',
    isAvailable: true,
  },
  {
    name: 'Limonata',
    description: 'Serinletici içecek',
    price: 80,
    category: 'Soğuk İçecek',
    image: '',
    isAvailable: true,
  },
  {
    name: 'Iced Latte',
    description: 'Soğuk sütlü kahve',
    price: 130,
    category: 'Soğuk İçecek',
    image: '',
    isAvailable: true,
  },
  {
    name: 'Çay',
    description: 'Demli sıcak çay',
    price: 40,
    category: 'Sıcak İçecek',
    image: '',
    isAvailable: true,
  },
  {
    name: 'Sıcak Çikolata',
    description: 'Yoğun kakao lezzeti',
    price: 95,
    category: 'Sıcak İçecek',
    image: '',
    isAvailable: true,
  },
];

const seedMenu = async () => {
  try {
    await connectDB();

    await MenuItem.deleteMany();
    await MenuItem.insertMany(menuItems);

    console.log('Menu verileri eklendi');
    process.exit();
  } catch (error) {
    console.error('Seed hatası:', error.message);
    process.exit(1);
  }
};

seedMenu();