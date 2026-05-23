import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { tableApi } from '../api/tableApi';
import { getTable } from '../api/responseHelpers';
import { useCart } from '../context/CartContext';
import AppButton from '../components/AppButton';
import Card, { CardBody } from '../components/Card';

const extractTableCode = (rawValue) => {
  if (!rawValue) return '';

  const value = String(rawValue).trim();

  const match = value.match(/\/table\/([^/]+)\/menu/i);
  if (match?.[1]) {
    return decodeURIComponent(match[1]);
  }

  try {
    const url = new URL(value);
    const parts = url.pathname.split('/').filter(Boolean);
    const tableIndex = parts.findIndex((part) => part === 'table');

    if (tableIndex !== -1 && parts[tableIndex + 1]) {
      return decodeURIComponent(parts[tableIndex + 1]);
    }
  } catch (error) {
    // QR direkt masa kodu olabilir.
  }

  return value;
};

export default function ScanTableScreen({ navigation }) {
  const { selectedTable, setSelectedTable, clearSelectedTable } = useCart();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleBarcodeScanned = async ({ data }) => {
    if (scanned) return;

    setScanned(true);
    setMessage('');
    setError('');

    const tableCode = extractTableCode(data);

    if (!tableCode) {
      setError('QR içinden masa kodu okunamadı.');
      return;
    }

    try {
      const response = await tableApi.getTableByCode(tableCode);
      const table = getTable(response);

      if (!table) {
        setError('Masa bilgisi bulunamadı.');
        return;
      }

      setSelectedTable(table);
      setMessage(`Masa ${table.number} seçildi.`);

      setTimeout(() => {
        navigation.navigate('MenuTab');
      }, 700);
    } catch (err) {
      setError(err.response?.data?.message || 'Masa bilgisi alınamadı.');
    }
  };

  if (!permission) {
    return (
      <View style={styles.page}>
        <Text style={styles.title}>QR Masa</Text>
        <Text style={styles.subtitle}>Kamera izni kontrol ediliyor...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.page}>
        <Text style={styles.title}>QR Masa</Text>
        <Text style={styles.subtitle}>
          Masa QR kodunu okutmak için kamera izni gerekiyor.
        </Text>

        <AppButton title="Kamera İzni Ver" onPress={requestPermission} />

        {selectedTable && (
          <SelectedTableBox
            table={selectedTable}
            onClear={clearSelectedTable}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <Text style={styles.title}>QR Masa</Text>
      <Text style={styles.subtitle}>
        Masadaki QR kodu okut, sipariş otomatik o masaya bağlansın.
      </Text>

      <View style={styles.cameraWrap}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        />
      </View>

      {message ? <Text style={styles.success}>{message}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.buttonRow}>
        <AppButton
          title="Tekrar Tara"
          variant="secondary"
          onPress={() => {
            setScanned(false);
            setMessage('');
            setError('');
          }}
        />

        <AppButton
          title="Menüye Git"
          onPress={() => navigation.navigate('MenuTab')}
        />
      </View>

      {selectedTable && (
        <SelectedTableBox table={selectedTable} onClear={clearSelectedTable} />
      )}
    </View>
  );
}

function SelectedTableBox({ table, onClear }) {
  return (
   <ScrollView>
    <Card>
      <CardBody>
        <Text style={styles.cardTitle}>Seçili Masa</Text>
        <Text style={styles.cardText}>
          Masa {table.number} · Kod: {table.code}
        </Text>
        <Text style={styles.cardText}>
          Kapasite: {table.capacity || 'Belirtilmedi'}
        </Text>

        <View style={{ marginTop: 12 }}>
          <AppButton title="Masa Seçimini Temizle" variant="danger" onPress={onClear} />
        </View>
      </CardBody>
    </Card>
   </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
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
    lineHeight: 21,
  },
  cameraWrap: {
    height: 360,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#0f172a',
  },
  camera: {
    flex: 1,
  },
  success: {
    color: '#15803d',
    fontWeight: '900',
  },
  error: {
    color: '#dc2626',
    fontWeight: '900',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: 8,
  },
  cardText: {
    color: '#64748b',
    marginTop: 4,
  },
});