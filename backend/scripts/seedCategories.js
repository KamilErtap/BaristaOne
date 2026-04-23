const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Category = require('../models/Category');

dotenv.config();

const categories = [
  { name: 'Kahve', description: 'Sıcak kahve çeşitleri', isActive: true },
  { name: 'Soğuk Kahve', description: 'Soğuk kahve çeşitleri', isActive: true },
  { name: 'Sıcak İçecek', description: 'Kahve dışı sıcak içecekler', isActive: true },
  { name: 'Soğuk İçecek', description: 'Serinletici içecekler', isActive: true },
  { name: 'Tatlı', description: 'Tatlı ve pasta ürünleri', isActive: true },
  { name: 'Atıştırmalık', description: 'Atıştırmalık ürünler', isActive: true },
  { name: 'Kahvaltı', description: 'Kahvaltı ürünleri', isActive: true },
  { name: 'Sandviç', description: 'Sandviç ve wrap ürünleri', isActive: true },
  { name: 'Salata', description: 'Salata çeşitleri', isActive: true },
];

const seedCategories = async () => {
  try {
    await connectDB();

    await Category.deleteMany();
    await Category.insertMany(categories);

    console.log(`${categories.length} kategori eklendi.`);
    process.exit();
  } catch (error) {
    console.error('Kategori seed hatası:', error.message);
    process.exit(1);
  }
};

seedCategories();