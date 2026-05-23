import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { menuApi } from '../api/menuApi';
import { getItem } from '../api/responseHelpers';
import { useCart } from '../context/CartContext';
import AppButton from '../components/AppButton';
import Card, { CardBody } from '../components/Card';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

export default function MenuDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { addToCart } = useCart();

  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchItem = async () => {
    try {
      setLoading(true);

      const response = await menuApi.getMenuItemById(id);
      setItem(getItem(response));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Ürün bilgisi alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [id]);

  const handleAddToCart = () => {
    if (!item?.isAvailable) {
      setMessage('Bu ürün şu anda müsait değil.');
      return;
    }

    addToCart(item, quantity);
    setMessage(`${item.name} sepete eklendi.`);

    setTimeout(() => {
      navigation.navigate('Cart');
    }, 500);
  };

  const decrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increase = () => {
    setQuantity((prev) => prev + 1);
  };

  if (loading) {
    return <Loading text="Ürün yükleniyor..." />;
  }

  if (error || !item) {
    return (
      <View style={styles.page}>
        <EmptyState
          title="Ürün bulunamadı"
          description={error || 'Bu ürün görüntülenemiyor.'}
        />

        <AppButton
          title="Menüye Dön"
          variant="secondary"
          onPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <AppButton
        title="Geri Dön"
        variant="secondary"
        onPress={() => navigation.goBack()}
      />

      <Card>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} />
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

          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.description}>
            {item.description || 'Açıklama yok'}
          </Text>

          <Text style={styles.price}>{item.price} TL</Text>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Text style={styles.sectionTitle}>Sepete Ekle</Text>

          <View style={styles.quantityRow}>
            <AppButton title="-" variant="secondary" onPress={decrease} />
            <Text style={styles.quantity}>{quantity}</Text>
            <AppButton title="+" variant="secondary" onPress={increase} />
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Ara Toplam</Text>
            <Text style={styles.totalValue}>
              {(item.price || 0) * quantity} TL
            </Text>
          </View>

          {message ? <Text style={styles.message}>{message}</Text> : null}

          <AppButton
            title="Sepete Ekle"
            onPress={handleAddToCart}
            disabled={!item.isAvailable}
          />
        </CardBody>
      </Card>
    </ScrollView>
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
  image: {
    width: '100%',
    height: 260,
    backgroundColor: '#e2e8f0',
  },
  placeholder: {
    height: 260,
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
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1f2937',
  },
  description: {
    color: '#64748b',
    marginTop: 10,
    lineHeight: 22,
  },
  price: {
    color: '#8b5e3c',
    fontSize: 26,
    fontWeight: '900',
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: 14,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  quantity: {
    minWidth: 42,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '900',
    color: '#1f2937',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 14,
    marginBottom: 14,
  },
  totalLabel: {
    color: '#64748b',
    fontWeight: '800',
  },
  totalValue: {
    color: '#8b5e3c',
    fontWeight: '900',
    fontSize: 18,
  },
  message: {
    color: '#15803d',
    fontWeight: '800',
    marginBottom: 12,
  },
});