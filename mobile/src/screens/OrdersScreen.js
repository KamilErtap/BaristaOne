import { useEffect, useMemo, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { orderApi } from '../api/orderApi';
import { getOrders } from '../api/responseHelpers';
import AppButton from '../components/AppButton';
import Card, { CardBody } from '../components/Card';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';

const ORDER_STATUS_LABELS = {
  received: 'Alındı',
  preparing: 'Hazırlanıyor',
  ready: 'Hazır',
  delivered: 'Teslim Edildi',
};

const PAYMENT_STATUS_LABELS = {
  paid: 'Ödendi',
  pending: 'Bekliyor',
  failed: 'Başarısız',
};

const STATUS_STYLES = {
  received: {
    backgroundColor: '#ede9fe',
    color: '#6d28d9',
  },
  preparing: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  ready: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  delivered: {
    backgroundColor: '#e2e8f0',
    color: '#475569',
  },
};

export default function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState('');

  const fetchOrders = async ({ silent = false } = {}) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await orderApi.getMyOrders({
        sort: 'newest',
      });

      setOrders(getOrders(response));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Siparişler alınamadı.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      active: orders.filter((order) => order.orderStatus !== 'delivered')
        .length,
      ready: orders.filter((order) => order.orderStatus === 'ready').length,
      delivered: orders.filter((order) => order.orderStatus === 'delivered')
        .length,
    };
  }, [orders]);

  const groupedOrders = useMemo(() => {
    return {
      activeOrders: orders.filter((order) => order.orderStatus !== 'delivered'),
      deliveredOrders: orders.filter(
        (order) => order.orderStatus === 'delivered'
      ),
    };
  }, [orders]);

  if (loading) {
    return <Loading text="Siparişler yükleniyor..." />;
  }

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchOrders({ silent: true })}
          tintColor="#8b5e3c"
        />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Siparişlerim</Text>
          <Text style={styles.subtitle}>
            Siparişlerinin durumunu buradan takip et.
          </Text>
        </View>

        <AppButton
          title="Yenile"
          variant="secondary"
          onPress={() => fetchOrders({ silent: true })}
        />
      </View>

      <View style={styles.statsGrid}>
        <StatCard title="Toplam" value={stats.total} />
        <StatCard title="Aktif" value={stats.active} />
        <StatCard title="Hazır" value={stats.ready} />
        <StatCard title="Teslim" value={stats.delivered} />
      </View>

      {error ? (
        <EmptyState title="Sipariş alınamadı" description={error} />
      ) : orders.length === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            title="Henüz sipariş yok"
            description="Checkout adımından sonra siparişlerini burada göreceksin."
          />

          <AppButton
            title="Menüye Git"
            onPress={() => navigation.navigate('MenuTab')}
          />
        </View>
      ) : (
        <>
          {groupedOrders.activeOrders.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Aktif Siparişler</Text>

              <View style={styles.list}>
                {groupedOrders.activeOrders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </View>
            </View>
          )}

          {groupedOrders.deliveredOrders.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Teslim Edilenler</Text>

              <View style={styles.list}>
                {groupedOrders.deliveredOrders.map((order) => (
                  <OrderCard key={order._id} order={order} muted />
                ))}
              </View>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

function StatCard({ title, value }) {
  return (
    <Card style={styles.statCard}>
      <CardBody>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </CardBody>
    </Card>
  );
}

function OrderCard({ order, muted = false }) {
  const statusStyle = STATUS_STYLES[order.orderStatus] || STATUS_STYLES.received;

  const totalQuantity =
    order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  return (
    <Card style={muted && styles.mutedCard}>
      <CardBody>
        <View style={styles.orderTop}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderTitle}>Masa {order.tableNumber}</Text>
            <Text style={styles.muted}>
              Sipariş No: {String(order._id).slice(-8)}
            </Text>
            <Text style={styles.muted}>
              {new Date(order.createdAt).toLocaleString('tr-TR')}
            </Text>
          </View>

          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Toplam</Text>
            <Text style={styles.totalValue}>{order.totalPrice} TL</Text>
          </View>
        </View>

        <View style={styles.badgeRow}>
          <Text
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusStyle.backgroundColor,
                color: statusStyle.color,
              },
            ]}
          >
            {ORDER_STATUS_LABELS[order.orderStatus] || order.orderStatus}
          </Text>

          <Text style={styles.paymentBadge}>
            {PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus}
          </Text>

          <Text style={styles.countBadge}>{totalQuantity} ürün</Text>
        </View>

        <View style={styles.itemsBox}>
          <Text style={styles.itemsTitle}>Ürünler</Text>

          {order.items?.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>
                {item.name} x {item.quantity}
              </Text>
              <Text style={styles.itemPrice}>
                {(item.price || 0) * item.quantity} TL
              </Text>
            </View>
          ))}
        </View>

        {order.orderStatus === 'received' && (
          <Text style={styles.progressText}>
            Siparişin alındı. Mutfak hazırlığı bekleniyor.
          </Text>
        )}

        {order.orderStatus === 'preparing' && (
          <Text style={styles.progressText}>
            Siparişin hazırlanıyor. Kahve kokusu yaklaşıyor.
          </Text>
        )}

        {order.orderStatus === 'ready' && (
          <Text style={styles.readyText}>
            Siparişin hazır. Garson masaya getirecek.
          </Text>
        )}

        {order.orderStatus === 'delivered' && (
          <Text style={styles.deliveredText}>
            Sipariş teslim edildi. Afiyet olsun.
          </Text>
        )}
      </CardBody>
    </Card>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    paddingTop: 64,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1f2937',
  },
  subtitle: {
    color: '#64748b',
    marginTop: 4,
    maxWidth: 220,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
  },
  statValue: {
    color: '#8b5e3c',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  statTitle: {
    color: '#64748b',
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 4,
    fontSize: 12,
  },
  emptyWrap: {
    gap: 14,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1f2937',
  },
  list: {
    gap: 14,
  },
  mutedCard: {
    opacity: 0.82,
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#1f2937',
  },
  muted: {
    color: '#64748b',
    marginTop: 4,
  },
  totalBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'flex-end',
    minWidth: 100,
  },
  totalLabel: {
    color: '#64748b',
    fontWeight: '700',
  },
  totalValue: {
    color: '#8b5e3c',
    fontWeight: '900',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 14,
  },
  statusBadge: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontWeight: '800',
  },
  paymentBadge: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontWeight: '800',
  },
  countBadge: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontWeight: '800',
  },
  itemsBox: {
    marginTop: 16,
  },
  itemsTitle: {
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  itemName: {
    flex: 1,
    color: '#1f2937',
    fontWeight: '700',
  },
  itemPrice: {
    color: '#8b5e3c',
    fontWeight: '900',
  },
  progressText: {
    marginTop: 12,
    color: '#92400e',
    fontWeight: '800',
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 14,
  },
  readyText: {
    marginTop: 12,
    color: '#166534',
    fontWeight: '800',
    backgroundColor: '#dcfce7',
    padding: 12,
    borderRadius: 14,
  },
  deliveredText: {
    marginTop: 12,
    color: '#475569',
    fontWeight: '800',
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 14,
  },
});