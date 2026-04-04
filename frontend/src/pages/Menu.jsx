import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import MenuCard from '../components/MenuCard';
import { useAuth } from '../context/AuthContext';

const Menu = () => {
  const { userInfo } = useAuth();
  //const isMobile = window.innerWidth < 900;
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderMessage, setOrderMessage] = useState('');

  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sort: '',
  });

  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('');

  const isCustomer = userInfo?.user?.role === 'customer';

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/menu/categories');
      setCategories(data);
    } catch (error) {
      console.error('Kategori verileri alınamadı');
    }
  };

  const fetchMenuItems = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams();

      if (filters.category) query.append('category', filters.category);
      if (filters.search) query.append('search', filters.search);
      if (filters.sort) query.append('sort', filters.sort);

      const { data } = await api.get(`/menu?${query.toString()}`);
      setItems(data);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Menü verileri alınamadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, [filters]);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const addToCart = (item) => {
    setOrderMessage('');

    setCart((prev) => {
      const exists = prev.find((cartItem) => cartItem._id === item._id);

      if (exists) {
        return prev.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const handleCreateOrder = async () => {
    setOrderMessage('');
    setError('');

    if (!userInfo) {
      setOrderMessage('Sipariş vermek için giriş yapmalısınız.');
      return;
    }

    if (!isCustomer) {
      setOrderMessage('Sadece müşteri hesabı sipariş verebilir.');
      return;
    }

    if (cart.length === 0) {
      setOrderMessage('Sepet boş.');
      return;
    }

    if (!tableNumber) {
      setOrderMessage('Lütfen masa numarası girin.');
      return;
    }

    try {
      const payload = {
        items: cart.map((item) => ({
          menuItem: item._id,
          quantity: item.quantity,
        })),
        tableNumber: Number(tableNumber),
        paymentStatus: 'paid',
      };

      const { data } = await api.post('/orders', payload);

      setOrderMessage(data.message || 'Sipariş oluşturuldu.');
      setCart([]);
      setTableNumber('');
    } catch (error) {
      setOrderMessage(error.response?.data?.message || 'Sipariş oluşturulamadı');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <h1 className='page-title'>Menü</h1>
        <p className='page-subtitle'>
          Kahveler, tatlılar ve masaya giden minik mutluluk paketleri.
        </p>

        <div style={styles.filterBox}>
          <input
            type="text"
            name="search"
            placeholder="Ürün ara..."
            value={filters.search}
            onChange={handleChange}
          />

          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            name="sort"
            value={filters.sort}
            onChange={handleChange}
          >
            <option value="">Varsayılan Sıralama</option>
            <option value="price_asc">Fiyat Artan</option>
            <option value="price_desc">Fiyat Azalan</option>
            <option value="name_asc">İsim A-Z</option>
            <option value="name_desc">İsim Z-A</option>
            <option value="newest">En Yeni</option>
            <option value="oldest">En Eski</option>
          </select>
        </div>

        {loading && <p>Menü yükleniyor...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {!loading && !error && (
          <div style={styles.grid}>
            {items.length > 0 ? (
              items.map((item) => (
                <MenuCard key={item._id} item={item} onAddToCart={addToCart} />
              ))
            ) : (
              <p>Gösterilecek ürün bulunamadı.</p>
            )}
          </div>
        )}
      </div>

      <div style={styles.right}>
        <h2>Sepet</h2>
        <p className="page-subtitle" style={{ marginBottom: '16px' }}>
          Seçtiğin ürünleri masa numarasıyla siparişe dönüştür.
        </p>

        {cart.length === 0 ? (
          <p>Sepet boş.</p>
        ) : (
          <>
            <div style={styles.cartList}>
              {cart.map((item) => (
                <div key={item._id} style={styles.cartItem}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.price} TL</p>
                    <p>Adet: {item.quantity}</p>
                  </div>

                  <div style={styles.cartButtons}>
                    <button onClick={() => decreaseQuantity(item._id)}>-</button>
                    <button onClick={() => increaseQuantity(item._id)}>+</button>
                    <button onClick={() => removeFromCart(item._id)}>Sil</button>
                  </div>
                </div>
              ))}
            </div>

            <input
              type="number"
              placeholder="Masa Numarası"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />

            <p style={styles.total}>
              Toplam: <strong>{totalPrice} TL</strong>
            </p>

            <button onClick={handleCreateOrder} style={styles.orderButton}>
              Siparişi Oluştur
            </button>
          </>
        )}

        {orderMessage && <p style={styles.message}>{orderMessage}</p>}
      </div>
    </div>
  );
};

const styles = {
  page: {
    width: 'min(1200px, calc(100% - 32px))',
    margin: '24px auto 40px',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
  },
  left: {},
  right: {
    background: '#fff',
    padding: '20px',
    borderRadius: '16px',
    height: 'fit-content',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
    border: '1px solid rgba(226, 232, 240, 0.7)',
    position: 'sticky',
    top: '96px',
  },
  filterBox: {
    display: 'flex',
    gap: '12px',
    margin: '20px 0 24px',
    flexWrap: 'wrap',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '18px',
  },
  error: {
    color: '#dc2626',
  },
  cartList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
  },
  cartItem: {
    border: '1px solid #e2e8f0',
    padding: '14px',
    borderRadius: '14px',
    background: '#f8fafc',
  },
  cartButtons: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
    flexWrap: 'wrap',
  },
  total: {
    margin: '16px 0',
    fontSize: '18px',
  },
  orderButton: {
    width: '100%',
    padding: '12px',
    background: '#8b5e3c',
    color: '#fff',
    borderRadius: '12px',
  },
  message: {
    marginTop: '16px',
    color: '#15803d',
  },
};

export default Menu;