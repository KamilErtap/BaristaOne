import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MenuStack from './MenuStack';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ScanTableScreen from '../screens/ScanTableScreen';
import { useCart } from '../context/CartContext';

const Tab = createBottomTabNavigator();

const getTabIcon = (routeName, focused) => {
  if (routeName === 'MenuTab') {
    return focused ? 'restaurant' : 'restaurant-outline';
  }

  if (routeName === 'ScanTable') {
    return focused ? 'qr-code' : 'qr-code-outline';
  }

  if (routeName === 'Cart') {
    return focused ? 'cart' : 'cart-outline';
  }

  if (routeName === 'Checkout') {
    return focused ? 'card' : 'card-outline';
  }

  if (routeName === 'Orders') {
    return focused ? 'receipt' : 'receipt-outline';
  }

  return focused ? 'ellipse' : 'ellipse-outline';
};

export default function CustomerTabs() {
  const { totalItems, selectedTable } = useCart();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#8b5e3c',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e2e8f0',
          height: 66 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 10),
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '800',
        },
        tabBarBadgeStyle: {
          backgroundColor: '#8b5e3c',
          color: '#fff',
          fontWeight: '900',
        },
        tabBarIcon: ({ color, focused, size }) => (
          <Ionicons
            name={getTabIcon(route.name, focused)}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen
        name="MenuTab"
        component={MenuStack}
        options={{
          title: 'Menü',
        }}
      />

      <Tab.Screen
        name="ScanTable"
        component={ScanTableScreen}
        options={{
          title: 'QR Masa',
          tabBarBadge: selectedTable ? '✓' : undefined,
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Sepet',
          tabBarBadge: totalItems > 0 ? totalItems : undefined,
        }}
      />

      <Tab.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          title: 'Ödeme',
        }}
      />

      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          title: 'Siparişler',
        }}
      />
    </Tab.Navigator>
  );
}