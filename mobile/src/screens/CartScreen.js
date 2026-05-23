import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useCart } from '../context/CartContext';
import AppButton from '../components/AppButton';
import Card, { CardBody } from '../components/Card';
import EmptyState from '../components/EmptyState';

export default function CartScreen({ navigation }) {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Sepet</Text>
          <Text style={styles.subtitle}>
            Siparişe geçmeden önce ürünlerini kontrol et.
          </Text>
        </View>

        {cart.length > 0 && (
          <AppButton title="Temizle" variant="danger" onPress={clearCart} />
        )}
      </View>

      {cart.length === 0 ? (
        <>
          <EmptyState
            title="Sepet boş"
            description="Menüden ürün seçip sepete ekleyebilirsin."
          />

          <AppButton
            title="Menüye Git"
            onPress={() => navigation.navigate('MenuTab')}
          />
        </>
      ) : (
        <>
          <View style={styles.list}>
            {cart.map((item) => (
              <CartItemCard
                key={item._id}
                item={item}
                onIncrease={() => increaseQuantity(item._id)}
                onDecrease={() => decreaseQuantity(item._id)}
                onRemove={() => removeFromCart(item._id)}
              />
            ))}
          </View>

          <Card>
            <CardBody>
              <Text style={styles.summaryTitle}>Sipariş Özeti</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Toplam Ürün</Text>
                <Text style={styles.summaryValue}>{totalItems}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Toplam Tutar</Text>
                <Text style={styles.summaryValue}>{totalPrice} TL</Text>
              </View>

              <AppButton
                title="Checkout'a Git"
                onPress={() => navigation.navigate('Checkout')}
              />
            </CardBody>
          </Card>
        </>
      )}
    </ScrollView>
  );
}

function CartItemCard({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <Card>
      <CardBody>
        <View style={styles.itemRow}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>Yok</Text>
            </View>
          )}

          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemMeta}>{item.category}</Text>
            <Text style={styles.itemPrice}>{item.price} TL</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <AppButton title="-" variant="secondary" onPress={onDecrease} />
          <Text style={styles.quantity}>{item.quantity}</Text>
          <AppButton title="+" variant="secondary" onPress={onIncrease} />
          <AppButton title="Sil" variant="danger" onPress={onRemove} />
        </View>

        <View style={styles.lineTotal}>
          <Text style={styles.summaryLabel}>Ara Toplam</Text>
          <Text style={styles.summaryValue}>
            {(item.price || 0) * item.quantity} TL
          </Text>
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
    maxWidth: 220,
  },
  list: {
    gap: 14,
  },
  itemRow: {
    flexDirection: 'row',
    gap: 14,
  },
  image: {
    width: 86,
    height: 86,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
  },
  imagePlaceholder: {
    width: 86,
    height: 86,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    color: '#64748b',
    fontWeight: '800',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1f2937',
  },
  itemMeta: {
    color: '#64748b',
    marginTop: 4,
  },
  itemPrice: {
    color: '#8b5e3c',
    fontWeight: '900',
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 14,
  },
  quantity: {
    fontSize: 20,
    fontWeight: '900',
    minWidth: 30,
    textAlign: 'center',
  },
  lineTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  summaryLabel: {
    color: '#64748b',
    fontWeight: '800',
  },
  summaryValue: {
    color: '#8b5e3c',
    fontWeight: '900',
  },
});