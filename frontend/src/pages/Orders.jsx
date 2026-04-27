import { useEffect, useMemo, useState } from 'react';
import { orderApi } from '../api/orderApi';
import { getOrders } from '../api/responseHelpers';

import PageHeader from '../components/common/PageHeader';
import Card, { CardBody } from '../components/common/Card';
import Select from '../components/common/Select';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

const ORDER_STATUS_CONFIG = {
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

const PAYMENT_STATUS_CONFIG = {
  paid: {
    label: 'Ödendi',
    variant: 'success',
  },
  pending: {
    label: 'Bekliyor',
    variant: 'warning',
  },
  failed: {
    label: 'Başarısız',
    variant: 'danger',
  },
};

const getStatusConfig = (status) => {
  return ORDER_STATUS_CONFIG[status] || {
    label: status || 'Bilinmiyor',
    variant: 'default',
  };
};

const getPaymentConfig = (status) => {
  return PAYMENT_STATUS_CONFIG[status] || {
    label: status || 'Bilinmiyor',
    variant: 'default',
  };
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    status: '',
    sort: 'newest',
  });

  const fetchOrders = async ({ silent = false } = {}) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await orderApi.getMyOrders(filters);
      setOrders(getOrders(response));

      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Siparişler alınamadı');
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  const clearFilters = () => {
    setFilters({
      status: '',
      sort: 'newest',
    });
  };

  const stats = useMemo(() => {
    const total = orders.length;
    const active = orders.filter(
      (order) => order.orderStatus !== 'delivered'
    ).length;
    const ready = orders.filter((order) => order.orderStatus === 'ready').length;
    const delivered = orders.filter(
      (order) => order.orderStatus === 'delivered'
    ).length;

    const totalPrice = orders.reduce((sum, order) => {
      return sum + (order.totalPrice || 0);
    }, 0);

    return {
      total,
      active,
      ready,
      delivered,
      totalPrice,
    };
  }, [orders]);

  if (loading) {
    return <Loading text="Siparişler yükleniyor..." />;
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Siparişlerim"
        subtitle="Siparişlerinin durumunu buradan takip edebilirsin."
        actions={
          <Button
            variant="secondary"
            onClick={() => fetchOrders({ silent: true })}
            disabled={refreshing}
          >
            {refreshing ? 'Yenileniyor...' : 'Yenile'}
          </Button>
        }
      />

      {error && <p className="message error">{error}</p>}

      {!error && (
        <>
          <div style={styles.statsGrid}>
            <StatCard title="Toplam Sipariş" value={stats.total} icon="🧾" />
            <StatCard title="Aktif" value={stats.active} icon="🔥" />
            <StatCard title="Hazır" value={stats.ready} icon="📦" />
            <StatCard title="Teslim" value={stats.delivered} icon="✅" />
            <StatCard title="Toplam Tutar" value={`${stats.totalPrice} TL`} icon="💰" />
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
                </Select>

                <div style={styles.filterButtonWrap}>
                  <Button variant="secondary" onClick={clearFilters}>
                    Filtreleri Temizle
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          <div style={styles.list}>
            {orders.length === 0 ? (
              <EmptyState
                title="Henüz sipariş bulunmuyor"
                description="Menüden ürün seçip checkout adımında sipariş oluşturabilirsin."
              />
            ) : (
              orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))
            )}
          </div>
        </>
      )}
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

const OrderCard = ({ order }) => {
  const orderStatus = getStatusConfig(order.orderStatus);
  const paymentStatus = getPaymentConfig(order.paymentStatus);

  return (
    <Card>
      <CardBody>
        <div style={styles.orderHeader}>
          <div>
            <div style={styles.titleRow}>
              <h3 style={{ margin: 0 }}>Masa {order.tableNumber}</h3>
              <Badge variant={orderStatus.variant}>{orderStatus.label}</Badge>
              <Badge variant={paymentStatus.variant}>{paymentStatus.label}</Badge>
            </div>

            <p style={styles.muted}>
              Sipariş No: {order._id}
            </p>

            <p style={styles.muted}>
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString('tr-TR')
                : 'Tarih yok'}
            </p>
          </div>

          <div style={styles.totalBox}>
            <span>Toplam</span>
            <strong>{order.totalPrice || 0} TL</strong>
          </div>
        </div>

        <div style={styles.itemsBox}>
          <strong>Ürünler</strong>

          <div style={styles.itemsList}>
            {order.items?.map((item, index) => (
              <div key={index} style={styles.itemRow}>
                <span>
                  {item.name} x {item.quantity}
                </span>
                <strong>{item.price * item.quantity} TL</strong>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const styles = {
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
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
    fontSize: '24px',
    color: '#8b5e3c',
  },
  statTitle: {
    marginTop: '10px',
    color: '#64748b',
    fontWeight: 700,
  },
  filterButtonWrap: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  list: {
    display: 'grid',
    gap: '16px',
    marginTop: '20px',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  titleRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
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
  muted: {
    color: '#64748b',
  },
};

export default Orders;