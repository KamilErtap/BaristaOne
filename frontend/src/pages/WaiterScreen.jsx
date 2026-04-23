import { useEffect, useMemo, useState } from 'react';
import { orderApi } from '../api/orderApi';
import { getOrders } from '../api/responseHelpers';

import PageHeader from '../components/common/PageHeader';
import Card, { CardBody } from '../components/common/Card';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';

const WaiterScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const [sort, setSort] = useState('table_asc');

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await orderApi.getAllOrders({
        status: 'ready',
        sort,
      });

      setOrders(getOrders(response));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Garson ekranı verileri alınamadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [sort]);

  const handleDelivered = async (orderId) => {
    try {
      setUpdatingOrderId(orderId);
      setMessage('');
      setError('');

      const response = await orderApi.updateOrderStatus(orderId, 'delivered');
      setMessage(response.data?.message || 'Sipariş teslim edildi');
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Sipariş teslim edilemedi');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const stats = useMemo(() => {
    const totalReady = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    const uniqueTables = new Set(orders.map((order) => order.tableNumber)).size;

    return {
      totalReady,
      totalRevenue,
      uniqueTables,
    };
  }, [orders]);

  if (loading) {
    return <Loading text="Waiter ekranı yükleniyor..." />;
  }

  return (
    <div>
      <PageHeader
        title="Waiter Screen"
        subtitle="Hazır siparişleri gör, masaya götür ve teslim edildi olarak işaretle."
        actions={
          <Button variant="secondary" onClick={fetchOrders}>
            Yenile
          </Button>
        }
      />

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}

      <div style={styles.statsGrid}>
        <WaiterStat title="Hazır Sipariş" value={stats.totalReady} icon="📦" />
        <WaiterStat title="Bekleyen Masa" value={stats.uniqueTables} icon="🪑" />
        <WaiterStat title="Toplam Tutar" value={`${stats.totalRevenue} TL`} icon="💰" />
      </div>

      <Card style={{ marginTop: '20px' }}>
        <CardBody>
          <div style={styles.toolbar}>
            <Select
              label="Sıralama"
              name="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="table_asc">Masa No Artan</option>
              <option value="table_desc">Masa No Azalan</option>
              <option value="oldest">En Eski</option>
              <option value="newest">En Yeni</option>
              <option value="price_desc">Tutar Azalan</option>
              <option value="price_asc">Tutar Artan</option>
            </Select>
          </div>
        </CardBody>
      </Card>

      <div style={styles.orderGrid}>
        {orders.length === 0 ? (
          <EmptyState
            title="Hazır sipariş yok"
            description="Teslim edilmeyi bekleyen sipariş bulunamadı."
          />
        ) : (
          orders.map((order) => (
            <WaiterOrderCard
              key={order._id}
              order={order}
              updating={updatingOrderId === order._id}
              onDelivered={handleDelivered}
            />
          ))
        )}
      </div>
    </div>
  );
};

const WaiterStat = ({ title, value, icon }) => {
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

const WaiterOrderCard = ({ order, updating, onDelivered }) => {
  return (
    <Card style={{ border: '2px solid rgba(34, 197, 94, 0.25)' }}>
      <CardBody>
        <div style={styles.orderHeader}>
          <div>
            <div style={styles.orderTitleRow}>
              <h2 style={{ margin: 0 }}>Masa {order.tableNumber}</h2>
              <Badge variant="success">Hazır</Badge>
            </div>

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
        </div>

        <div style={styles.itemsBox}>
          <strong>Teslim Edilecek Ürünler</strong>

          <div style={styles.itemsList}>
            {order.items?.map((item, index) => (
              <div key={index} style={styles.itemRow}>
                <span>{item.name}</span>
                <strong>x {item.quantity}</strong>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.actionRow}>
          <Button
            variant="success"
            disabled={updating}
            onClick={() => onDelivered(order._id)}
          >
            {updating ? 'Teslim ediliyor...' : 'Teslim Edildi'}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

const styles = {
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '14px',
  },
  statTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  toolbar: {
    display: 'grid',
    gridTemplateColumns: '280px',
    gap: '12px',
  },
  orderGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '16px',
    marginTop: '20px',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '14px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  orderTitleRow: {
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
    minWidth: '120px',
    textAlign: 'right',
  },
  customerBox: {
    marginTop: '16px',
    padding: '14px',
    borderRadius: '14px',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
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
    paddingBottom: '8px',
    borderBottom: '1px solid #e2e8f0',
  },
  actionRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '18px',
  },
  muted: {
    color: '#64748b',
  },
};

export default WaiterScreen;