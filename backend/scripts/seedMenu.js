const dotenv = require('dotenv');
const connectDB = require('../config/db');
const MenuItem = require('../models/MenuItem');

dotenv.config();

const menuItems = [
  // Kahve
  {
    name: 'Espresso',
    description: 'Yoğun aromalı, kısa ve sert klasik İtalyan kahvesi.',
    price: 90,
    category: 'Kahve',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a',
    isAvailable: true,
  },
  {
    name: 'Double Espresso',
    description: 'İki shot espresso ile daha yoğun kahve deneyimi.',
    price: 120,
    category: 'Kahve',
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf',
    isAvailable: true,
  },
  {
    name: 'Americano',
    description: 'Espresso üzerine sıcak su eklenerek hazırlanan sade kahve.',
    price: 100,
    category: 'Kahve',
    image: 'https://images.unsplash.com/photo-1494314671902-399b18174975',
    isAvailable: true,
  },
  {
    name: 'Latte',
    description: 'Espresso, sıcak süt ve yumuşak süt köpüğü ile hazırlanır.',
    price: 130,
    category: 'Kahve',
    image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78',
    isAvailable: true,
  },
  {
    name: 'Cappuccino',
    description: 'Espresso, süt ve yoğun süt köpüğünün dengeli birleşimi.',
    price: 125,
    category: 'Kahve',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38',
    isAvailable: true,
  },
  {
    name: 'Flat White',
    description: 'Espresso ve ince dokulu süt ile hazırlanan yumuşak kahve.',
    price: 135,
    category: 'Kahve',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c',
    isAvailable: true,
  },
  {
    name: 'Mocha',
    description: 'Espresso, süt ve çikolata aromasının birleşimi.',
    price: 145,
    category: 'Kahve',
    image: 'https://images.unsplash.com/photo-1579888071069-c107a6f79d82',
    isAvailable: true,
  },
  {
    name: 'Caramel Macchiato',
    description: 'Espresso, süt ve karamel aromasıyla hazırlanan özel kahve.',
    price: 155,
    category: 'Kahve',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772',
    isAvailable: true,
  },
  {
    name: 'Türk Kahvesi',
    description: 'Geleneksel yöntemle pişirilen yoğun aromalı Türk kahvesi.',
    price: 85,
    category: 'Kahve',
    image: 'https://images.unsplash.com/photo-1610632380989-680fe40816c6',
    isAvailable: true,
  },
  {
    name: 'Filtre Kahve',
    description: 'Günlük demleme, sade ve dengeli filtre kahve.',
    price: 95,
    category: 'Kahve',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31',
    isAvailable: true,
  },

  // Soğuk Kahve
  {
    name: 'Iced Americano',
    description: 'Espresso, soğuk su ve buz ile hazırlanan ferah kahve.',
    price: 115,
    category: 'Soğuk Kahve',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c',
    isAvailable: true,
  },
  {
    name: 'Iced Latte',
    description: 'Espresso, soğuk süt ve buz ile hazırlanan sütlü kahve.',
    price: 140,
    category: 'Soğuk Kahve',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5',
    isAvailable: true,
  },
  {
    name: 'Iced Mocha',
    description: 'Soğuk süt, espresso ve çikolata aromasıyla hazırlanır.',
    price: 150,
    category: 'Soğuk Kahve',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735',
    isAvailable: true,
  },
  {
    name: 'Cold Brew',
    description: 'Uzun süre soğuk demleme yöntemiyle hazırlanan yumuşak kahve.',
    price: 160,
    category: 'Soğuk Kahve',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c',
    isAvailable: true,
  },
  {
    name: 'Frappe',
    description: 'Buz, süt ve kahve ile hazırlanan köpüklü soğuk içecek.',
    price: 155,
    category: 'Soğuk Kahve',
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371',
    isAvailable: true,
  },

  // Sıcak İçecek
  {
    name: 'Çay',
    description: 'Taze demlenmiş klasik Türk çayı.',
    price: 35,
    category: 'Sıcak İçecek',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3',
    isAvailable: true,
  },
  {
    name: 'Bitki Çayı',
    description: 'Rahatlatıcı karışım bitki çayı.',
    price: 70,
    category: 'Sıcak İçecek',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574',
    isAvailable: true,
  },
  {
    name: 'Sıcak Çikolata',
    description: 'Yoğun kakao aromalı, sıcak ve yumuşak içecek.',
    price: 95,
    category: 'Sıcak İçecek',
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed',
    isAvailable: true,
  },
  {
    name: 'Salep',
    description: 'Tarçınla servis edilen geleneksel sıcak içecek.',
    price: 100,
    category: 'Sıcak İçecek',
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61',
    isAvailable: true,
  },
  {
    name: 'Chai Tea Latte',
    description: 'Baharatlı çay karışımı ve süt ile hazırlanan sıcak içecek.',
    price: 125,
    category: 'Sıcak İçecek',
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f',
    isAvailable: true,
  },

  // Soğuk İçecek
  {
    name: 'Limonata',
    description: 'Taze limon aromalı serinletici içecek.',
    price: 85,
    category: 'Soğuk İçecek',
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859',
    isAvailable: true,
  },
  {
    name: 'Nane Limonata',
    description: 'Limonata ve taze nane ile ferahlatıcı içecek.',
    price: 95,
    category: 'Soğuk İçecek',
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859',
    isAvailable: true,
  },
  {
    name: 'Portakal Suyu',
    description: 'Taze sıkılmış portakal suyu.',
    price: 110,
    category: 'Soğuk İçecek',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba',
    isAvailable: true,
  },
  {
    name: 'Ice Tea Şeftali',
    description: 'Şeftali aromalı soğuk çay.',
    price: 75,
    category: 'Soğuk İçecek',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc',
    isAvailable: true,
  },
  {
    name: 'Ice Tea Limon',
    description: 'Limon aromalı soğuk çay.',
    price: 75,
    category: 'Soğuk İçecek',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc',
    isAvailable: true,
  },
  {
    name: 'Maden Suyu',
    description: 'Serinletici doğal maden suyu.',
    price: 40,
    category: 'Soğuk İçecek',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504',
    isAvailable: true,
  },
  {
    name: 'Su',
    description: 'Şişe su.',
    price: 25,
    category: 'Soğuk İçecek',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504',
    isAvailable: true,
  },

  // Tatlı
  {
    name: 'Cheesecake',
    description: 'Kremamsı dokusu ve meyveli sosuyla klasik cheesecake.',
    price: 155,
    category: 'Tatlı',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad',
    isAvailable: true,
  },
  {
    name: 'San Sebastian Cheesecake',
    description: 'Yanık üst yüzeyi ve akışkan iç dokusuyla özel cheesecake.',
    price: 175,
    category: 'Tatlı',
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f',
    isAvailable: true,
  },
  {
    name: 'Brownie',
    description: 'Yoğun çikolatalı, yumuşak dokulu brownie.',
    price: 140,
    category: 'Tatlı',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c',
    isAvailable: true,
  },
  {
    name: 'Tiramisu',
    description: 'Kahve aromalı, mascarpone kremalı İtalyan tatlısı.',
    price: 160,
    category: 'Tatlı',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9',
    isAvailable: true,
  },
  {
    name: 'Magnolia',
    description: 'Kremalı, meyveli ve bisküvili hafif tatlı.',
    price: 135,
    category: 'Tatlı',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
    isAvailable: true,
  },
  {
    name: 'Sufle',
    description: 'İçi akışkan sıcak çikolatalı tatlı.',
    price: 150,
    category: 'Tatlı',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51',
    isAvailable: true,
  },
  {
    name: 'Waffle',
    description: 'Taze meyveler, çikolata ve soslarla servis edilen waffle.',
    price: 180,
    category: 'Tatlı',
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d',
    isAvailable: true,
  },

  // Atıştırmalık
  {
    name: 'Patates Kızartması',
    description: 'Çıtır patates kızartması.',
    price: 95,
    category: 'Atıştırmalık',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f',
    isAvailable: true,
  },
  {
    name: 'Mozzarella Sticks',
    description: 'Çıtır kaplamalı mozzarella peynir çubukları.',
    price: 135,
    category: 'Atıştırmalık',
    image: 'https://images.unsplash.com/photo-1548340748-6d2b7d7da280',
    isAvailable: true,
  },
  {
    name: 'Soğan Halkası',
    description: 'Çıtır kaplamalı soğan halkaları.',
    price: 100,
    category: 'Atıştırmalık',
    image: 'https://images.unsplash.com/photo-1639024471283-03518883512d',
    isAvailable: true,
  },
  {
    name: 'Nachos',
    description: 'Tortilla cipsi, sos ve peynir ile servis edilir.',
    price: 145,
    category: 'Atıştırmalık',
    image: 'https://images.unsplash.com/photo-1513456852971-30b0c0cd200d',
    isAvailable: true,
  },

  // Kahvaltı
  {
    name: 'Serpme Kahvaltı',
    description: 'Peynir, zeytin, reçel, yumurta ve sıcak ekmek ile geniş kahvaltı tabağı.',
    price: 320,
    category: 'Kahvaltı',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666',
    isAvailable: true,
  },
  {
    name: 'Menemen',
    description: 'Domates, biber ve yumurta ile hazırlanan klasik menemen.',
    price: 130,
    category: 'Kahvaltı',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8',
    isAvailable: true,
  },
  {
    name: 'Sahanda Yumurta',
    description: 'Tereyağında pişirilmiş sade sahanda yumurta.',
    price: 95,
    category: 'Kahvaltı',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8',
    isAvailable: true,
  },
  {
    name: 'Avokadolu Tost',
    description: 'Avokado, yumurta ve özel sosla hazırlanan tost.',
    price: 160,
    category: 'Kahvaltı',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8',
    isAvailable: true,
  },
  {
    name: 'Kaşarlı Tost',
    description: 'Bol kaşarlı klasik tost.',
    price: 95,
    category: 'Kahvaltı',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af',
    isAvailable: true,
  },
  {
    name: 'Karışık Tost',
    description: 'Kaşar ve sucuk ile hazırlanan karışık tost.',
    price: 115,
    category: 'Kahvaltı',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af',
    isAvailable: true,
  },

  // Ana Yemek / Sandviç
  {
    name: 'Tavuklu Sandviç',
    description: 'Izgara tavuk, yeşillik ve özel sosla hazırlanan sandviç.',
    price: 165,
    category: 'Sandviç',
    image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122',
    isAvailable: true,
  },
  {
    name: 'Ton Balıklı Sandviç',
    description: 'Ton balığı, mısır, yeşillik ve sos ile hazırlanır.',
    price: 170,
    category: 'Sandviç',
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980',
    isAvailable: true,
  },
  {
    name: 'Club Sandwich',
    description: 'Tavuk, yumurta, peynir ve yeşillikle hazırlanan doyurucu sandviç.',
    price: 190,
    category: 'Sandviç',
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980',
    isAvailable: true,
  },
  {
    name: 'Tavuklu Wrap',
    description: 'Tavuk parçaları, sebze ve sos ile hazırlanan wrap.',
    price: 175,
    category: 'Sandviç',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f',
    isAvailable: true,
  },
  {
    name: 'Sezar Salata',
    description: 'Marul, tavuk, kruton ve sezar sos ile hazırlanan salata.',
    price: 165,
    category: 'Salata',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1',
    isAvailable: true,
  },
  {
    name: 'Akdeniz Salata',
    description: 'Mevsim yeşillikleri, peynir, zeytin ve özel sos ile hazırlanır.',
    price: 150,
    category: 'Salata',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
    isAvailable: true,
  },

  // Bazı ürünler tükendi örneği
  {
    name: 'Pumpkin Spice Latte',
    description: 'Baharatlı balkabağı aromalı özel sezonluk latte.',
    price: 165,
    category: 'Kahve',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    isAvailable: false,
  },
  {
    name: 'Çilekli Tart',
    description: 'Taze çilek ve pastacı kremasıyla hazırlanan tart.',
    price: 145,
    category: 'Tatlı',
    image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81',
    isAvailable: false,
  },
];

const seedMenu = async () => {
  try {
    await connectDB();

    await MenuItem.deleteMany();
    await MenuItem.insertMany(menuItems);

    console.log(`${menuItems.length} adet menü ürünü eklendi.`);
    process.exit();
  } catch (error) {
    console.error('Seed hatası:', error.message);
    process.exit(1);
  }
};

seedMenu();