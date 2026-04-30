import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function Loading({ text = 'Yükleniyor...' }) {
  return (
    <View style={styles.page}>
      <ActivityIndicator size="large" color="#8b5e3c" />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  text: {
    color: '#64748b',
    fontWeight: '700',
  },
});