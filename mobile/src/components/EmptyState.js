import { StyleSheet, Text, View } from 'react-native';

export default function EmptyState({
  title = 'Veri bulunamadı',
  description = 'Daha sonra tekrar deneyebilirsin.',
}) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 18,
    padding: 18,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1f2937',
  },
  description: {
    marginTop: 6,
    color: '#64748b',
    lineHeight: 21,
  },
});