import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import CustomerTabs from './CustomerTabs';
import StaffTabs from './StaffTabs';

const CUSTOMER_ROLE = 'customer';

export default function RootNavigator() {
  const { userInfo, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingPage}>
        <ActivityIndicator size="large" color="#8b5e3c" />
        <Text style={styles.loadingText}>Oturum kontrol ediliyor...</Text>
      </View>
    );
  }

  const role = userInfo?.user?.role;
  const isCustomer = role === CUSTOMER_ROLE;

  return (
    <NavigationContainer>
      {!userInfo ? (
        <AuthNavigator />
      ) : isCustomer ? (
        <CustomerTabs />
      ) : (
        <StaffTabs />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingPage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    gap: 12,
  },
  loadingText: {
    color: '#64748b',
    fontWeight: '700',
  },
});