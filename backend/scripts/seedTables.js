const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Table = require('../models/Table');

dotenv.config();

const tables = [
  { number: 1, code: 'TBL-001', capacity: 2, isActive: true, description: 'Pencere kenarı küçük masa' },
  { number: 2, code: 'TBL-002', capacity: 2, isActive: true, description: 'Pencere kenarı küçük masa' },
  { number: 3, code: 'TBL-003', capacity: 4, isActive: true, description: 'Orta alan masa' },
  { number: 4, code: 'TBL-004', capacity: 4, isActive: true, description: 'Orta alan masa' },
  { number: 5, code: 'TBL-005', capacity: 6, isActive: true, description: 'Kalabalık grup masası' },
  { number: 6, code: 'TBL-006', capacity: 6, isActive: true, description: 'Kalabalık grup masası' },
  { number: 7, code: 'TBL-007', capacity: 2, isActive: false, description: 'Bakımda / pasif masa' },
];

const seedTables = async () => {
  try {
    await connectDB();

    await Table.deleteMany();
    await Table.insertMany(tables);

    console.log(`${tables.length} masa eklendi.`);
    process.exit();
  } catch (error) {
    console.error('Masa seed hatası:', error.message);
    process.exit(1);
  }
};

seedTables();