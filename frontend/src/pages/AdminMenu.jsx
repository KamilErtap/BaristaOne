import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { menuApi } from '../api/menuApi';
import { getCategories, getItems } from '../api/responseHelpers';

import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Card, { CardBody } from '../components/common/Card';
import EmptyState from '../components/common/EmptyState';
import Loading from '../components/common/Loading';
import Input from '../components/common/Input';
import Select from '../components/common/Select';

const AdminMenu = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await menuApi.getCategories();
      setCategories(getCategories(response));
    } catch (err) {
      console.error('Kategoriler alınamadı');
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);

      const response = await menuApi.getMenuItems(filters);
      setItems(getItems(response));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Menü verileri alınamadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) {
    return <Loading text="Ürünler yükleniyor..." />;
  }

  return (
    <div>
      <PageHeader
        title="Menü Yönetimi"
        subtitle="Menüdeki ürünleri görüntüle, filtrele ve düzenle."
        actions={
          <Button variant="primary" onClick={() => navigate('/admin/menu/new')}>
            Yeni Ürün Ekle
          </Button>
        }
      />

      <div className="admin-filter-box">
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

      {error && <p className="message error">{error}</p>}

      {!error && items.length === 0 && (
        <EmptyState
          title="Ürün bulunamadı"
          description="Yeni ürün ekleyebilir veya filtreleri değiştirebilirsin."
        />
      )}

      {!error && items.length > 0 && (
        <div style={styles.grid}>
          {items.map((item) => (
            <Card key={item._id} style={{ overflow: 'hidden' }}>
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  style={styles.image}
                />
              ) : (
                <div style={styles.placeholder}>Görsel Yok</div>
              )}

              <CardBody>
                <div style={styles.topRow}>
                  <span className="badge">{item.category}</span>
                  <span className="badge">
                    {item.isAvailable ? 'Müsait' : 'Tükendi'}
                  </span>
                </div>

                <h3 style={styles.title}>{item.name}</h3>
                <p style={styles.description}>{item.description}</p>

                <div style={styles.bottom}>
                  <strong style={styles.price}>{item.price} TL</strong>

                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/admin/menu/${item._id}`)}
                  >
                    Detay / Düzenle
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '18px',
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    display: 'block',
  },
  placeholder: {
    width: '100%',
    height: '180px',
    display: 'grid',
    placeItems: 'center',
    background: '#e2e8f0',
    color: '#64748b',
    fontWeight: 700,
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '14px',
  },
  title: {
    fontSize: '20px',
    marginBottom: '8px',
  },
  description: {
    color: '#64748b',
    minHeight: '48px',
  },
  bottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '16px',
  },
  price: {
    fontSize: '20px',
    color: '#8b5e3c',
  },
};

export default AdminMenu;