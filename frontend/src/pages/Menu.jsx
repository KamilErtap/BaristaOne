import { useEffect, useState } from 'react';
import { menuApi } from '../api/menuApi';
import { getCategories, getItems } from '../api/responseHelpers';
import MenuCard from '../components/MenuCard';
import { useCart } from '../context/CartContext';

import PageHeader from '../components/common/PageHeader';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import EmptyState from '../components/common/EmptyState';
import Loading from '../components/common/Loading';

const Menu = () => {
  const { addToCart } = useCart();

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sort: '',
  });

  const fetchCategories = async () => {
    try {
      const response = await menuApi.getCategories();
      setCategories(getCategories(response));
    } catch (error) {
      console.error('Kategori verileri alınamadı');
    }
  };

  const fetchMenuItems = async () => {
    try {
      setLoading(true);

      const response = await menuApi.getMenuItems(filters);
      setItems(getItems(response));
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

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    setMessage(`${item.name} sepete eklendi.`);

    setTimeout(() => {
      setMessage('');
    }, 1500);
  };

  if (loading) {
    return <Loading text="Menü yükleniyor..." />;
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Menü"
        subtitle="Kahveler, tatlılar ve masaya giden minik mutluluk paketleri."
      />

      <div className="menu-filter-box">
        <Input
          name="search"
          placeholder="Ürün ara..."
          value={filters.search}
          onChange={handleFilterChange}
        />

        <Select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>

        <Select
          name="sort"
          value={filters.sort}
          onChange={handleFilterChange}
        >
          <option value="">Varsayılan Sıralama</option>
          <option value="price_asc">Fiyat Artan</option>
          <option value="price_desc">Fiyat Azalan</option>
          <option value="name_asc">İsim A-Z</option>
          <option value="name_desc">İsim Z-A</option>
          <option value="newest">En Yeni</option>
          <option value="oldest">En Eski</option>
        </Select>
      </div>

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}

      {!error && items.length > 0 && (
        <div style={styles.grid}>
          {items.map((item) => (
            <MenuCard
              key={item._id}
              item={item}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}

      {!error && items.length === 0 && (
        <EmptyState
          title="Ürün bulunamadı"
          description="Arama veya filtreleme kriterlerini değiştirerek tekrar deneyebilirsin."
        />
      )}
    </div>
  );
};

const styles = {
  filterBox: {
    display: 'grid',
    gridTemplateColumns: '1fr 220px 220px',
    gap: '12px',
    margin: '20px 0 24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '18px',
  },
};

export default Menu;