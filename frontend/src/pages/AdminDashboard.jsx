import { useEffect, useMemo, useState } from 'react';
import { menuApi } from '../api/menuApi';
import { orderApi } from '../api/orderApi';
import { getItems, getOrders } from '../api/responseHelpers';

import PageHeader from '../components/common/PageHeader';
import Card, { CardBody } from '../components/common/Card';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';

const AdminDashboard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [menuResponse, ordersResponse] = await Promise.all([
        menuApi.getMenuItems(),
        orderApi.getAllOrders(),
      ]);

      setMenuItems(getItems(menuResponse));
      setOrders(getOrders(ordersResponse));

      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Dashboard verileri alınamadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = useMemo(() => {
    const totalProducts = menuItems.length;
    const availableProducts = menuItems.filter((item) => item.isAvailable).length;
    const totalOrders = orders.length;
    const activeOrders = orders.filter(
      (order) => order.orderStatus !== 'delivered'
    ).length;

    const totalRevenue = orders.reduce((sum, order) => {
      return sum + (order.totalPrice || 0);
    }, 0);

    const preparingOrders = orders.filter(
      (order) => order.orderStatus === 'preparing'
    ).length;

    const readyOrders = orders.filter(
      (order) => order.orderStatus === 'ready'
    ).length;

    return {
      totalProducts,
      availableProducts,
      totalOrders,
      activeOrders,
      totalRevenue,
      preparingOrders,
      readyOrders,
    };
  }, [menuItems, orders]);

  const recentOrders = orders.slice(0, 5);

  if (loading) {
    return <Loading text="Dashboard yükleniyor..." />;
  }

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle="BaristaOne operasyon özetini buradan takip edebilirsin."
      />

      {error && <p className="message error">{error}</p>}

      {!error && (
        <>
          <div style={styles.statsGrid}>
            <StatCard
              title="Toplam Ürün"
              value={stats.totalProducts}
              description="Menüdeki toplam ürün"
              icon="☕"
            />

            <StatCard
              title="Mevcut Ürün"
              value={stats.availableProducts}
              description="Satışa açık ürün"
              icon="✅"
            />

            <StatCard
              title="Toplam Sipariş"
              value={stats.totalOrders}
              description="Sistemdeki toplam sipariş"
              icon="🧾"
            />

            <StatCard
              title="Aktif Sipariş"
              value={stats.activeOrders}
              description="Teslim edilmemiş sipariş"
              icon="🔥"
            />

            <StatCard
              title="Hazırlanıyor"
              value={stats.preparingOrders}
              description="Mutfakta hazırlanan sipariş"
              icon="👨‍🍳"
            />

            <StatCard
              title="Hazır"
              value={stats.readyOrders}
              description="Teslim edilmeyi bekleyen sipariş"
              icon="📦"
            />

            <StatCard
              title="Toplam Gelir"
              value={`${stats.totalRevenue} TL`}
              description="Siparişlerden gelen toplam tutar"
              icon="💰"
              wide
            />
          </div>

          <div style={styles.section}>
            <Card>
              <CardBody>
                <h2 style={styles.sectionTitle}>Son Siparişler</h2>

                {recentOrders.length === 0 ? (
                  <EmptyState
                    title="Henüz sipariş yok"
                    description="Siparişler oluştuğunda burada listelenecek."
                  />
                ) : (
                  <div style={styles.orderList}>
                    {recentOrders.map((order) => (
                      <div key={order._id} style={styles.orderRow}>
                        <div>
                          <strong>Masa {order.tableNumber}</strong>
                          <p style={styles.muted}>
                            {order.customer?.name || 'Müşteri'} · {order.totalPrice} TL
                          </p>
                        </div>

                        <span style={styles.statusBadge}>
                          {getStatusLabel(order.orderStatus)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

const StatCard = ({ title, value, description, icon, wide = false }) => {
  return (
    <Card style={wide ? styles.wideCard : undefined}>
      <CardBody>
        <div style={styles.statTop}>
          <span style={styles.statIcon}>{icon}</span>
          <span style={styles.statValue}>{value}</span>
        </div>

        <h3 style={styles.statTitle}>{title}</h3>
        <p style={styles.muted}>{description}</p>
      </CardBody>
    </Card>
  );
};

const getStatusLabel = (status) => {
  const labels = {
    received: 'Alındı',
    preparing: 'Hazırlanıyor',
    ready: 'Hazır',
    delivered: 'Teslim Edildi',
  };

  return labels[status] || status;
};

const styles = {
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  wideCard: {
    gridColumn: 'span 2',
  },
  statTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '14px',
  },
  statIcon: {
    width: '44px',
    height: '44px',
    display: 'grid',
    placeItems: 'center',
    borderRadius: '14px',
    background: '#f1f5f9',
    fontSize: '22px',
  },
  statValue: {
    fontSize: '26px',
    fontWeight: 800,
    color: '#8b5e3c',
  },
  statTitle: {
    marginBottom: '4px',
  },
  muted: {
    color: '#64748b',
  },
  section: {
    marginTop: '24px',
  },
  sectionTitle: {
    marginBottom: '16px',
  },
  orderList: {
    display: 'grid',
    gap: '12px',
  },
  orderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    padding: '14px',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    background: '#f8fafc',
  },
  statusBadge: {
    borderRadius: '999px',
    padding: '6px 10px',
    background: '#ede9fe',
    color: '#6d28d9',
    fontWeight: 700,
    fontSize: '13px',
  },
};

export default AdminDashboard;