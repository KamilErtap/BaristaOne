import { useEffect, useState } from 'react';
import api from '../api/axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    status: '',
    sort: 'newest',
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams();

      if (filters.status) query.append('status', filters.status);
      if (filters.sort) query.append('sort', filters.sort);

      const { data } = await api.get(`/orders?${query.toString()}`);
      setOrders(data);
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
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleStatusUpdate = async (orderId, orderStatus) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, {
        orderStatus,
      });

      setMessage(data.message || 'Sipariş durumu güncellendi');
      fetchOrders();
    } catch (error) {
      setError(error.response?.data?.message || 'Durum güncellenemedi');
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Admin Sipariş Yönetimi</h1>
      <p className="page-subtitle">
        Tüm siparişleri görüntüle ve durumlarını güncelle.
      </p>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

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
          <option value="table_asc">Masa No Artan</option>
          <option value="table_desc">Masa No Azalan</option>
        </select>
      </div>

      {loading && <p>Siparişler yükleniyor...</p>}

      {!loading && orders.length === 0 && <p>Henüz sipariş yok.</p>}

      {!loading && orders.length > 0 && (
        <div style={styles.list}>
          {orders.map((order) => (
            <div key={order._id} style={styles.card}>
              <h3>Sipariş No: {order._id}</h3>
              <p><strong>Müşteri:</strong> {order.customer?.name}</p>
              <p><strong>Email:</strong> {order.customer?.email}</p>
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

              <div style={styles.statusButtons}>
                <button onClick={() => handleStatusUpdate(order._id, 'received')}>
                  Alındı
                </button>
                <button onClick={() => handleStatusUpdate(order._id, 'preparing')}>
                  Hazırlanıyor
                </button>
                <button onClick={() => handleStatusUpdate(order._id, 'ready')}>
                  Hazır
                </button>
                <button onClick={() => handleStatusUpdate(order._id, 'delivered')}>
                  Teslim Edildi
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
  },
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
  },
  statusButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '16px',
  },
  success: {
    color: 'green',
  },
  error: {
    color: 'red',
  },
};

export default AdminOrders;