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

const STATUS_LABELS = {
  received: 'Alındı',
  preparing: 'Hazırlanıyor',
  ready: 'Hazır',
  delivered: 'Teslim Edildi',
};

export default function KitchenScreen() {
  const { logout } = useAuth();

  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchOrders = useCallback(
    async ({ silent = false, nextStatus = status } = {}) => {
        try {
            if (silent) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response = await orderApi.getAllOrders({
                status: nextStatus,
                sort: 'oldest',
            });

            const allOrders = getOrders(response);
            const activeOrders = allOrders.filter(
                (order) => order.orderStatus !== 'delivered'
            );

            setOrders(activeOrders);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Mutfak siparişleri alınamadı.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    },
    [status]
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const intercalId = setInterval(() => {
        fetchOrders({ silent: true });
    }, 15000);

    return () => clearInterval(intercalId);
  }, [fetchOrders]);

  const handleStatusFilter = (nextStatus) => {
    setStatus(nextStatus);
    fetchOrders({
      silent: true,
      nextStatus,
    });
  };

  const updateStatus = async (orderId, nextStatus) => {
    try {
      setUpdatingOrderId(orderId);
      setMessage('');
      setError('');

      const response = await orderApi.updateOrderStatus(orderId, nextStatus);

      setMessage(response.data?.message || 'Sipariş güncellendi.');
      await fetchOrders({ silent: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Sipariş güncellenemedi.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const stats = useMemo(() => {
    return {
      total: orders.length,
      received: orders.filter((order) => order.orderStatus === 'received')
        .length,
      preparing: orders.filter((order) => order.orderStatus === 'preparing')
        .length,
      ready: orders.filter((order) => order.orderStatus === 'ready').length,
    };
  }, [orders]);

  if (loading) {
    return <Loading text="Mutfak ekranı yükleniyor..." />;
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
          <Text style={styles.title}>Mutfak</Text>
          <Text style={styles.subtitle}>
            Aktif siparişleri takip et. Liste 15 saniyede bir yenilenir.
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
        <StatCard title="Toplam" value={stats.total} />
        <StatCard title="Alındı" value={stats.received} />
        <StatCard title="Hazırlanıyor" value={stats.preparing} />
        <StatCard title="Hazır" value={stats.ready} />
      </View>

      <Card>
        <CardBody>
          <Text style={styles.filterTitle}>Durum Filtresi</Text>

          <View style={styles.filterRow}>
            <FilterButton
              title="Tümü"
              active={!status}
              onPress={() => handleStatusFilter('')}
            />
            <FilterButton
              title="Alındı"
              active={status === 'received'}
              onPress={() => handleStatusFilter('received')}
            />
            <FilterButton
              title="Hazırlanıyor"
              active={status === 'preparing'}
              onPress={() => handleStatusFilter('preparing')}
            />
            <FilterButton
              title="Hazır"
              active={status === 'ready'}
              onPress={() => handleStatusFilter('ready')}
            />
          </View>
        </CardBody>
      </Card>

      {message ? <Text style={styles.success}>{message}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {orders.length === 0 ? (
        <EmptyState
          title="Aktif sipariş yok"
          description="Mutfakta hazırlanacak sipariş bulunmuyor."
        />
      ) : (
        <View style={styles.list}>
          {orders.map((order) => (
            <KitchenOrderCard
              key={order._id}
              order={order}
              updating={updatingOrderId === order._id}
              onUpdateStatus={updateStatus}
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

function FilterButton({ title, active, onPress }) {
  return (
    <View style={styles.filterButton}>
      <AppButton
        title={title}
        variant={active ? 'primary' : 'secondary'}
        onPress={onPress}
      />
    </View>
  );
}

function KitchenOrderCard({ order, updating, onUpdateStatus }) {
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

          <View style={styles.statusBox}>
            <Text style={styles.statusText}>
              {STATUS_LABELS[order.orderStatus] || order.orderStatus}
            </Text>
          </View>
        </View>

        <View style={styles.customerBox}>
          <Text style={styles.customerTitle}>Müşteri</Text>
          <Text style={styles.muted}>
            {order.customer?.name || 'Bilinmeyen müşteri'}
          </Text>
        </View>

        <View style={styles.itemsBox}>
          <Text style={styles.itemsTitle}>Ürünler</Text>

          {order.items?.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>x {item.quantity}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          {order.orderStatus === 'received' && (
            <AppButton
              title={updating ? 'Güncelleniyor...' : 'Hazırlanıyor'}
              disabled={updating}
              onPress={() => onUpdateStatus(order._id, 'preparing')}
            />
          )}

          {order.orderStatus === 'preparing' && (
            <AppButton
              title={updating ? 'Güncelleniyor...' : 'Hazır'}
              disabled={updating}
              onPress={() => onUpdateStatus(order._id, 'ready')}
            />
          )}

          {order.orderStatus === 'ready' && (
            <Text style={styles.readyText}>
              Sipariş hazır. Garson teslim ekranında görünecek.
            </Text>
          )}
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
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  statTitle: {
    color: '#64748b',
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 4,
    fontSize: 11,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    minWidth: 110,
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
  statusBox: {
    backgroundColor: '#fef3c7',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#92400e',
    fontWeight: '900',
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
  readyText: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: 12,
    borderRadius: 14,
    fontWeight: '800',
  },
  headerText: {
    flex: 1,
  },
  headerActions: {
    gap: 8,
    minWidth: 96,
  },
});