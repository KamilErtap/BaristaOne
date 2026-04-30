import { useEffect, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { menuApi } from '../api/menuApi';
import { getItems } from '../api/responseHelpers';
import { useAuth } from '../context/AuthContext';
import AppButton from '../components/AppButton';
import Card, { CardBody } from '../components/Card';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

export default function MenuScreen() {
  const { userInfo, logout } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState('');

  const fetchMenuItems = async ({ silent = false } = {}) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await menuApi.getMenuItems();
      setItems(getItems(response));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Menü verileri alınamadı.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  if (loading) {
    return <Loading text="Menü yükleniyor..." />;
  }

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchMenuItems({ silent: true })}
          tintColor="#8b5e3c"
        />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Menü</Text>
          <Text style={styles.subtitle}>
            Hoş geldin, {userInfo?.user?.name || 'Müşteri'}.
          </Text>
        </View>

        <AppButton title="Çıkış" variant="danger" onPress={logout} />
      </View>

      {error ? (
        <EmptyState title="Menü alınamadı" description={error} />
      ) : items.length === 0 ? (
        <EmptyState
          title="Ürün bulunamadı"
          description="Menüde gösterilecek ürün yok."
        />
      ) : (
        <View style={styles.list}>
          {items.map((item) => (
            <MenuItemCard key={item._id} item={item} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function MenuItemCard({ item }) {
  return (
    <Card>
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Görsel Yok</Text>
        </View>
      )}

      <CardBody>
        <View style={styles.badgeRow}>
          <Text style={styles.badge}>{item.category || 'Kategori'}</Text>
          <Text style={styles.badge}>
            {item.isAvailable ? 'Müsait' : 'Tükendi'}
          </Text>
        </View>

        <Text style={styles.itemTitle}>{item.name}</Text>

        <Text style={styles.description} numberOfLines={2}>
          {item.description || 'Açıklama yok'}
        </Text>

        <Text style={styles.price}>{item.price} TL</Text>
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
    fontSize: 16,
    marginTop: 4,
  },
  list: {
    gap: 16,
  },
  image: {
    width: '100%',
    height: 190,
    backgroundColor: '#e2e8f0',
  },
  placeholder: {
    height: 190,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#64748b',
    fontWeight: '800',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 13,
    fontWeight: '700',
  },
  itemTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#1f2937',
  },
  description: {
    color: '#64748b',
    marginTop: 8,
    lineHeight: 21,
  },
  price: {
    color: '#8b5e3c',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 14,
  },
});