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

const KitchenScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await orderApi.getAllOrders({
        status: statusFilter || undefined,
        sort: 'oldest',
      });

      const allOrders = getOrders(response);
      const activeOrders = allOrders.filter(
        (order) => order.orderStatus !== 'delivered'
      );

      setOrders(activeOrders);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Mutfak siparişleri alınamadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusUpdate = async (orderId, orderStatus) => {
    try {
      setUpdatingOrderId(orderId);
      setMessage('');
      setError('');

      const response = await orderApi.updateOrderStatus(orderId, orderStatus);
      setMessage(response.data?.message || 'Sipariş güncellendi');

      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Sipariş güncellenemedi');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const stats = useMemo(() => {
    return {
      total: orders.length,
      received: orders.filter((o) => o.orderStatus === 'received').length,
      preparing: orders.filter((o) => o.orderStatus === 'preparing').length,
      ready: orders.filter((o) => o.orderStatus === 'ready').length,
    };
  }, [orders]);

  if (loading) {
    return <Loading text="Mutfak ekranı yükleniyor..." />;
  }

  return (
    <div>
      <PageHeader
        title="Kitchen Screen"
        subtitle="Aktif siparişleri takip et, hazırlamaya başla ve hazır durumuna geçir."
        actions={
          <Button variant="secondary" onClick={fetchOrders}>
            Yenile
          </Button>
        }
      />

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}

      <div style={styles.statsGrid}>
        <KitchenStat title="Toplam Aktif" value={stats.total} icon="🔥" />
        <KitchenStat title="Yeni" value={stats.received} icon="📥" />
        <KitchenStat title="Hazırlanıyor" value={stats.preparing} icon="👨‍🍳" />
        <KitchenStat title="Hazır" value={stats.ready} icon="📦" />
      </div>

      <Card style={{ marginTop: '20px' }}>
        <CardBody>
          <div style={styles.toolbar}>
            <Select
              label="Duruma Göre Filtrele"
              name="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tüm Aktif Siparişler</option>
              <option value="received">Yeni</option>
              <option value="preparing">Hazırlanıyor</option>
              <option value="ready">Hazır</option>
            </Select>
          </div>
        </CardBody>
      </Card>

      <div style={styles.orderGrid}>
        {orders.length === 0 ? (
          <EmptyState
            title="Aktif sipariş yok"
            description="Mutfakta gösterilecek sipariş bulunamadı."
          />
        ) : (
          orders.map((order) => (
            <KitchenOrderCard
              key={order._id}
              order={order}
              updating={updatingOrderId === order._id}
              onStatusUpdate={handleStatusUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
};

const KitchenStat = ({ title, value, icon }) => {
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

const KitchenOrderCard = ({ order, updating, onStatusUpdate }) => {
  const isNew = order.orderStatus === 'received';
  const isPreparing = order.orderStatus === 'preparing';
  const isReady = order.orderStatus === 'ready';

  return (
    <Card
      style={{
        border: isNew
          ? '2px solid rgba(139, 92, 246, 0.35)'
          : isPreparing
          ? '2px solid rgba(245, 158, 11, 0.35)'
          : isReady
          ? '2px solid rgba(34, 197, 94, 0.35)'
          : undefined,
      }}
    >
      <CardBody>
        <div style={styles.orderHeader}>
          <div>
            <div style={styles.orderTitleRow}>
              <h2 style={{ margin: 0 }}>Masa {order.tableNumber}</h2>
              <StatusBadge status={order.orderStatus} />
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
          <strong>Hazırlanacak Ürünler</strong>

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
            variant={isNew ? 'primary' : 'secondary'}
            disabled={updating}
            onClick={() => onStatusUpdate(order._id, 'received')}
          >
            Yeni
          </Button>

          <Button
            variant={isPreparing ? 'primary' : 'secondary'}
            disabled={updating}
            onClick={() => onStatusUpdate(order._id, 'preparing')}
          >
            Hazırlanıyor
          </Button>

          <Button
            variant={isReady ? 'success' : 'secondary'}
            disabled={updating}
            onClick={() => onStatusUpdate(order._id, 'ready')}
          >
            Hazır
          </Button>
        </div>

        {updating && <p className="message">Durum güncelleniyor...</p>}
      </CardBody>
    </Card>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    received: {
      label: 'Yeni',
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

export default KitchenScreen;