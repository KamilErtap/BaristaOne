import { useEffect, useState } from 'react';
import { orderApi } from '../api/orderApi';
import { getOrders } from '../api/responseHelpers';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    status: '',
    sort: 'newest',
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await orderApi.getMyOrders(filters);
      setOrders(getOrders(response));

      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Siparişler alınamadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Siparişlerim</h1>
      <p className="page-subtitle">
        Siparişlerinin durumunu buradan takip edebilirsin.
      </p>

      <div style={styles.filters}>
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
        >
          <option value="">Tüm Durumlar</option>
          <option value="received">Alındı</option>
          <option value="preparing">Hazırlanıyor</option>
          <option value="ready">Hazır</option>
          <option value="delivered">Teslim Edildi</option>
        </select>

        <select
          name="sort"
          value={filters.sort}
          onChange={handleChange}
        >
          <option value="newest">En Yeni</option>
          <option value="oldest">En Eski</option>
          <option value="price_asc">Fiyat Artan</option>
          <option value="price_desc">Fiyat Azalan</option>
        </select>
      </div>

      {loading && <p>Siparişler yükleniyor...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p>Henüz sipariş bulunmuyor.</p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div style={styles.list}>
          {orders.map((order) => (
            <div key={order._id} style={styles.card}>
              <h3>Sipariş No: {order._id}</h3>
              <p><strong>Masa:</strong> {order.tableNumber}</p>
              <p><strong>Ödeme:</strong> {order.paymentStatus}</p>
              <p><strong>Durum:</strong> {order.orderStatus}</p>
              <p><strong>Toplam:</strong> {order.totalPrice} TL</p>
              <p>
                <strong>Tarih:</strong>{' '}
                {new Date(order.createdAt).toLocaleString('tr-TR')}
              </p>

              <div style={styles.items}>
                <strong>Ürünler:</strong>
                {order.items.map((item, index) => (
                  <div key={index} style={styles.itemRow}>
                    {item.name} x {item.quantity} - {item.price} TL
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {},
  filters: {
    display: 'flex',
    gap: '12px',
    margin: '20px 0',
    flexWrap: 'wrap',
  },
  list: {
    display: 'grid',
    gap: '16px',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '18px',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
    border: '1px solid rgba(226, 232, 240, 0.7)',
  },
  items: {
    marginTop: '12px',
  },
  itemRow: {
    marginTop: '6px',
    color: '#475569',
  },
  error: {
    color: '#dc2626',
  },
};

export default Orders;