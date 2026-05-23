import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { useAuth } from '../context/AuthContext';

export default function WaiterScreen() {
  const { logout } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async ({ silent = false } = {}) => {
    try {
        if (silent) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        const response = await orderApi.getAllOrders({
            status: 'ready',
            sort: 'table_asc',
        });

        setOrders(getOrders(response));
        setError('');
    } catch (err) {
        setError(err.response?.data?.message || 'Garson siparişleri alınamadı.');
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const intercalId = setInterval(() => {
        fetchOrders({ silent: true });
    }, 15000);

    return () => clearInterval(intercalId);
  }, [fetchOrders]);

  const handleDelivered = async (orderId) => {
    try {
      setUpdatingOrderId(orderId);
      setMessage('');
      setError('');

      const response = await orderApi.updateOrderStatus(orderId, 'delivered');

      setMessage(response.data?.message || 'Sipariş teslim edildi.');
      await fetchOrders({ silent: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Sipariş teslim edilemedi.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const stats = useMemo(() => {
    const tableCount = new Set(orders.map((order) => order.tableNumber)).size;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.totalPrice || 0),
      0
    );

    return {
      ready: orders.length,
      tableCount,
      totalRevenue,
    };
  }, [orders]);

  if (loading) {
    return <Loading text="Garson ekranı yükleniyor..." />;
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
        <View style={styles.headerText}>
          <Text style={styles.title}>Garson</Text>
          <Text style={styles.subtitle}>
            Hazır siparişleri teslim et. Liste 15 saniyede bir yenilenir.
          </Text>
        </View>

        <View style={styles.headerActions}>
          <AppButton
            title="Yenile"
            variant="secondary"
            onPress={() => fetchOrders({ silent: true })}
          />

          <AppButton title="Çıkış" variant="danger" onPress={logout} />
        </View>
      </View>

      <View style={styles.statsGrid}>
        <StatCard title="Hazır" value={stats.ready} />
        <StatCard title="Masa" value={stats.tableCount} />
        <StatCard title="Tutar" value={`${stats.totalRevenue} TL`} />
      </View>

      {message ? <Text style={styles.success}>{message}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {orders.length === 0 ? (
        <EmptyState
          title="Hazır sipariş yok"
          description="Teslim edilmeyi bekleyen sipariş bulunmuyor."
        />
      ) : (
        <View style={styles.list}>
          {orders.map((order) => (
            <WaiterOrderCard
              key={order._id}
              order={order}
              updating={updatingOrderId === order._id}
              onDelivered={handleDelivered}
            />
          ))}
        </View>
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

function WaiterOrderCard({ order, updating, onDelivered }) {
  return (
    <Card>
      <CardBody>
        <View style={styles.orderTop}>
          <View>
            <Text style={styles.orderTitle}>Masa {order.tableNumber}</Text>
            <Text style={styles.muted}>
              {new Date(order.createdAt).toLocaleString('tr-TR')}
            </Text>
          </View>

          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Toplam</Text>
            <Text style={styles.totalValue}>{order.totalPrice} TL</Text>
          </View>
        </View>

        <View style={styles.customerBox}>
          <Text style={styles.customerTitle}>Müşteri</Text>
          <Text style={styles.muted}>
            {order.customer?.name || 'Bilinmeyen müşteri'}
          </Text>
        </View>

        <View style={styles.itemsBox}>
          <Text style={styles.itemsTitle}>Teslim Edilecek Ürünler</Text>

          {order.items?.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>x {item.quantity}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <AppButton
            title={updating ? 'Teslim ediliyor...' : 'Teslim Edildi'}
            disabled={updating}
            onPress={() => onDelivered(order._id)}
          />
        </View>
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
    maxWidth: 230,
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
    fontSize: 20,
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
  success: {
    color: '#15803d',
    fontWeight: '900',
  },
  error: {
    color: '#dc2626',
    fontWeight: '900',
  },
  list: {
    gap: 14,
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  orderTitle: {
    fontSize: 22,
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
  customerBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
  },
  customerTitle: {
    fontWeight: '900',
    color: '#1f2937',
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
  itemQuantity: {
    color: '#8b5e3c',
    fontWeight: '900',
  },
  actions: {
    marginTop: 14,
  },
  headerText: {
    flex: 1,
  },
  headerActions: {
    gap: 8,
    minWidth: 96,
  },
});