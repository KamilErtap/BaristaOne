import { useEffect, useMemo, useState } from 'react';
import { orderApi } from '../api/orderApi';
import { getOrders } from '../api/responseHelpers';

import PageHeader from '../components/common/PageHeader';
import Card, { CardBody } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import EmptyState from '../components/common/EmptyState';
import Loading from '../components/common/Loading';
import Badge from '../components/common/Badge';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const [filters, setFilters] = useState({
    status: '',
    sort: 'newest',
    tableNumber: '',
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await orderApi.getAllOrders(filters);
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
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      sort: 'newest',
      tableNumber: '',
    });
  };

  const handleStatusUpdate = async (orderId, orderStatus) => {
    try {
      setUpdatingOrderId(orderId);
      setMessage('');
      setError('');

      const response = await orderApi.updateOrderStatus(orderId, orderStatus);
      setMessage(response.data?.message || 'Sipariş durumu güncellendi');
      await fetchOrders();
    } catch (error) {
      setError(error.response?.data?.message || 'Durum güncellenemedi');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const received = orders.filter((order) => order.orderStatus === 'received').length;
    const preparing = orders.filter((order) => order.orderStatus === 'preparing').length;
    const ready = orders.filter((order) => order.orderStatus === 'ready').length;
    const delivered = orders.filter((order) => order.orderStatus === 'delivered').length;
    const active = orders.filter((order) => order.orderStatus !== 'delivered').length;

    return {
      totalOrders,
      received,
      preparing,
      ready,
      delivered,
      active,
    };
  }, [orders]);

  if (loading) {
    return <Loading text="Siparişler yükleniyor..." />;
  }

  return (
    <div>
      <PageHeader
        title="Sipariş Yönetimi"
        subtitle="Tüm siparişleri takip et, filtrele ve durumlarını güncelle."
        actions={
          <Button variant="secondary" onClick={fetchOrders}>
            Yenile
          </Button>
        }
      />

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}

      <div style={styles.statsGrid}>
        <StatCard title="Toplam" value={stats.totalOrders} icon="🧾" />
        <StatCard title="Aktif" value={stats.active} icon="🔥" />
        <StatCard title="Alındı" value={stats.received} icon="📥" />
        <StatCard title="Hazırlanıyor" value={stats.preparing} icon="👨‍🍳" />
        <StatCard title="Hazır" value={stats.ready} icon="📦" />
        <StatCard title="Teslim" value={stats.delivered} icon="✅" />
      </div>

      <Card style={{ marginTop: '20px' }}>
        <CardBody>
          <div className="admin-filter-box">
            <Select
              label="Durum"
              name="status"
              value={filters.status}
              onChange={handleChange}
            >
              <option value="">Tüm Durumlar</option>
              <option value="received">Alındı</option>
              <option value="preparing">Hazırlanıyor</option>
              <option value="ready">Hazır</option>
              <option value="delivered">Teslim Edildi</option>
            </Select>

            <Select
              label="Sıralama"
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
            </Select>

            <Input
              label="Masa No"
              name="tableNumber"
              type="number"
              min="1"
              placeholder="Örn: 4"
              value={filters.tableNumber}
              onChange={handleChange}
            />
          </div>

          <Button variant="secondary" onClick={clearFilters}>
            Filtreleri Temizle
          </Button>
        </CardBody>
      </Card>

      <div style={styles.orderList}>
        {orders.length === 0 ? (
          <EmptyState
            title="Sipariş bulunamadı"
            description="Filtreleri değiştirerek tekrar deneyebilirsin."
          />
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onStatusUpdate={handleStatusUpdate}
              updating={updatingOrderId === order._id}
            />
          ))
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => {
  return (
    <Card>
      <CardBody>
        <div style={styles.statTop}>
          <span style={styles.statIcon}>{icon}</span>
          <strong style={styles.statValue}>{value}</strong>
        </div>
        <p style={styles.statTitle}>{title}</p>
      </CardBody>
    </Card>
  );
};

const OrderCard = ({ order, onStatusUpdate, updating }) => {
  const isActive = order.orderStatus !== 'delivered';

  return (
    <Card
      style={{
        border: isActive ? '1px solid rgba(139, 94, 60, 0.35)' : undefined,
      }}
    >
      <CardBody>
        <div style={styles.orderHeader}>
          <div>
            <div style={styles.orderTitleRow}>
              <h3>Masa {order.tableNumber}</h3>
              <StatusBadge status={order.orderStatus} />
            </div>

            <p style={styles.muted}>
              Sipariş No: {order._id}
            </p>

            <p style={styles.muted}>
              {new Date(order.createdAt).toLocaleString('tr-TR')}
            </p>
          </div>

          <div style={styles.totalBox}>
            <span>Toplam</span>
            <strong>{order.totalPrice} TL</strong>
          </div>
        </div>

        <div style={styles.customerBox}>
          <strong>Müşteri</strong>
          <p style={styles.muted}>
            {order.customer?.name || 'Bilinmeyen müşteri'}
          </p>
          <p style={styles.muted}>
            {order.customer?.email || 'Email yok'}
          </p>
        </div>

        <div style={styles.itemsBox}>
          <strong>Ürünler</strong>

          <div style={styles.itemsList}>
            {order.items.map((item, index) => (
              <div key={index} style={styles.itemRow}>
                <span>{item.name} x {item.quantity}</span>
                <strong>{item.price * item.quantity} TL</strong>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.statusActions}>
          <Button
            variant={order.orderStatus === 'received' ? 'primary' : 'secondary'}
            disabled={updating}
            onClick={() => onStatusUpdate(order._id, 'received')}
          >
            Alındı
          </Button>

          <Button
            variant={order.orderStatus === 'preparing' ? 'primary' : 'secondary'}
            disabled={updating}
            onClick={() => onStatusUpdate(order._id, 'preparing')}
          >
            Hazırlanıyor
          </Button>

          <Button
            variant={order.orderStatus === 'ready' ? 'primary' : 'secondary'}
            disabled={updating}
            onClick={() => onStatusUpdate(order._id, 'ready')}
          >
            Hazır
          </Button>

          <Button
            variant={order.orderStatus === 'delivered' ? 'success' : 'secondary'}
            disabled={updating}
            onClick={() => onStatusUpdate(order._id, 'delivered')}
          >
            Teslim Edildi
          </Button>
        </div>

        {updating && <p className="message">Sipariş güncelleniyor...</p>}
      </CardBody>
    </Card>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    received: {
      label: 'Alındı',
      variant: 'primary',
    },
    preparing: {
      label: 'Hazırlanıyor',
      variant: 'warning',
    },
    ready: {
      label: 'Hazır',
      variant: 'success',
    },
    delivered: {
      label: 'Teslim Edildi',
      variant: 'default',
    },
  };

  const item = config[status] || {
    label: status,
    variant: 'default',
  };

  return <Badge variant={item.variant}>{item.label}</Badge>;
};

const styles = {
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '14px',
  },
  statTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
  },
  statIcon: {
    width: '42px',
    height: '42px',
    display: 'grid',
    placeItems: 'center',
    borderRadius: '14px',
    background: '#f1f5f9',
    fontSize: '22px',
  },
  statValue: {
    fontSize: '26px',
    color: '#8b5e3c',
  },
  statTitle: {
    marginTop: '10px',
    color: '#64748b',
    fontWeight: 700,
  },
  orderList: {
    display: 'grid',
    gap: '16px',
    marginTop: '20px',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
  },
  orderTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '8px',
  },
  totalBox: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '12px 16px',
    display: 'grid',
    gap: '4px',
    minWidth: '140px',
    textAlign: 'right',
  },
  customerBox: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '14px',
    marginTop: '16px',
  },
  itemsBox: {
    marginTop: '16px',
  },
  itemsList: {
    display: 'grid',
    gap: '8px',
    marginTop: '10px',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '8px',
  },
  statusActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '18px',
  },
  muted: {
    color: '#64748b',
  },
};

export default AdminOrders;