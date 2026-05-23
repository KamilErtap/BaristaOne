import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { orderApi } from '../api/orderApi';
import { useCart } from '../context/CartContext';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import Card, { CardBody } from '../components/Card';
import EmptyState from '../components/EmptyState';

export default function CheckoutScreen({ navigation }) {
  const {
    cart,
    clearCart,
    totalItems,
    totalPrice,
    selectedTable,
    clearSelectedTable,
  } = useCart();

  const [tableNumber, setTableNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedTable?.number) {
        setTableNumber(String(selectedTable.number));
    }
  }, [selectedTable]);

  const handleSubmit = async () => {
    setMessage('');
    setError('');

    if (cart.length === 0) {
      setError('Sepet boş.');
      return;
    }

    if (!tableNumber) {
      setError('Lütfen masa numarası gir.');
      return;
    }

    try {
      setSubmitting(true);

      const response = await orderApi.createOrder({
        cart,
        tableNumber,
      });

      setMessage(response.data?.message || 'Sipariş başarıyla oluşturuldu.');
      clearCart();
      setTableNumber('');

      setTimeout(() => {
        navigation.navigate('Orders');
      }, 600);
    } catch (err) {
      setError(err.response?.data?.message || 'Sipariş oluşturulamadı.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <View style={styles.emptyPage}>
        <Text style={styles.title}>Ödeme</Text>

        <EmptyState
          title="Sepet boş"
          description="Sipariş oluşturmak için önce menüden ürün eklemelisin."
        />

        <AppButton
          title="Menüye Git"
          onPress={() => navigation.navigate('MenuTab')}
        />

        <AppButton
          title="Siparişlerim"
          variant="secondary"
          onPress={() => navigation.navigate('Orders')}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardPage}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.page} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Ödeme</Text>
        <Text style={styles.subtitle}>
          Masa numaranı girerek siparişini tamamla.
        </Text>

        <Card>
          <CardBody>
            <Text style={styles.sectionTitle}>Sipariş Bilgileri</Text>

            <View style={styles.form}>
              <AppInput
                label="Masa Numarası"
                placeholder="Örn: 4"
                value={tableNumber}
                onChangeText={selectedTable ? undefined : setTableNumber}
                keyboardType="numeric"
                editable={!selectedTable}
              />

              {selectedTable && (
                <View style={styles.selectedTableBox}>
                    <Text style={styles.selectedTableTitle}>Seçili Masa</Text>
                    <Text style={styles.selectedTableText}>
                        Masa {selectedTable.number} · Kod: {selectedTable.code}
                    </Text>

                    <View style={styles.clearTableButton}>
                        <AppButton
                            title="Masa Seçimini Temizle"
                            variant="secondary"
                            onPress={() => {
                                clearSelectedTable();
                                setTableNumber('');
                            }}
                        />
                    </View>
                </View>         
              )}

              {!selectedTable && (
                <View style={styles.qrHintBox}>
                  <Text style={styles.qrHintTitle}>QR ile masa seçebilirsin</Text>
                  <Text style={styles.qrHintText}>
                    Masadaki QR kodu okutarak masa numarasını otomatik doldurabilirsin.
                  </Text>

                  <View style={styles.qrHintButton}>
                    <AppButton
                      title="QR Masa'ya Git"
                      variant="secondary"
                      onPress={() => navigation.navigate('ScanTable')}
                    />
                  </View>
                </View>
              )}

              <View style={styles.paymentBox}>
                <Text style={styles.paymentTitle}>Ödeme Durumu</Text>
                <Text style={styles.paymentText}>
                  Bu sürümde ödeme simülasyon olarak tamamlanmış kabul edilir.
                </Text>
                <Text style={styles.badge}>Ödendi</Text>
              </View>

              {message ? <Text style={styles.success}>{message}</Text> : null}
              {error ? <Text style={styles.error}>{error}</Text> : null}

              <AppButton
                title={
                  submitting ? 'Sipariş oluşturuluyor...' : 'Siparişi Tamamla'
                }
                onPress={handleSubmit}
                loading={submitting}
              />
            </View>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Text style={styles.sectionTitle}>Sipariş Özeti</Text>

            <View style={styles.items}>
              {cart.map((item) => (
                <View key={item._id} style={styles.itemRow}>
                  <Text style={styles.itemText}>
                    {item.name} x {item.quantity}
                  </Text>
                  <Text style={styles.itemTotal}>
                    {(item.price || 0) * item.quantity} TL
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Toplam Ürün</Text>
              <Text style={styles.summaryValue}>{totalItems}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Toplam Tutar</Text>
              <Text style={styles.summaryValue}>{totalPrice} TL</Text>
            </View>

            <AppButton
              title="Sepete Dön"
              variant="secondary"
              onPress={() => navigation.navigate('Cart')}
            />
          </CardBody>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardPage: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  page: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    paddingTop: 64,
    gap: 16,
  },
  emptyPage: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
    paddingTop: 64,
    gap: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1f2937',
  },
  subtitle: {
    color: '#64748b',
    marginTop: -8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: 14,
  },
  form: {
    gap: 12,
  },
  paymentBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  paymentTitle: {
    fontWeight: '900',
    color: '#1f2937',
  },
  paymentText: {
    color: '#64748b',
    lineHeight: 21,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#dcfce7',
    color: '#166534',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontWeight: '800',
  },
  success: {
    color: '#15803d',
    fontWeight: '800',
  },
  error: {
    color: '#dc2626',
    fontWeight: '800',
  },
  items: {
    gap: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 10,
  },
  itemText: {
    flex: 1,
    color: '#1f2937',
    fontWeight: '700',
  },
  itemTotal: {
    color: '#8b5e3c',
    fontWeight: '900',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
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
  selectedTableBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 14,
  },
  selectedTableTitle: {
    color: '#1f2937',
    fontWeight: '900',
  },
  selectedTableText: {
    color: '#64748b',
    marginTop: 6,
  },
  clearTableButton: {
    marginTop: 12,
  },
  qrHintBox: {
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
    borderRadius: 16,
    padding: 14,
  },
  qrHintTitle: {
    color: '#9a3412',
    fontWeight: '900',
  },
  qrHintText: {
    color: '#9a3412',
    marginTop: 6,
    lineHeight: 21,
  },
  qrHintButton: {
    marginTop: 12,
  },
});