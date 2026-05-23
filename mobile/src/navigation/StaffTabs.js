import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import KitchenScreen from '../screens/KitchenScreen';
import WaiterScreen from '../screens/WaiterScreen';
import OrdersScreen from '../screens/OrdersScreen';
import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();

const getTabIcon = (routeName, focused) => {
  if (routeName === 'Kitchen') {
    return focused ? 'flame' : 'flame-outline';
  }

  if (routeName === 'Waiter') {
    return focused ? 'walk' : 'walk-outline';
  }

  if (routeName === 'Orders') {
    return focused ? 'receipt' : 'receipt-outline';
  }

  return focused ? 'ellipse' : 'ellipse-outline';
};

export default function StaffTabs() {
  const { userInfo } = useAuth();
  const role = userInfo?.user?.role;

  const canSeeKitchen = ['admin', 'owner', 'kitchen'].includes(role);
  const canSeeWaiter = ['admin', 'owner', 'waiter'].includes(role);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#8b5e3c',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e2e8f0',
          height: 66,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '800',
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
      {canSeeKitchen && (
        <Tab.Screen
          name="Kitchen"
          component={KitchenScreen}
          options={{ title: 'Mutfak' }}
        />
      )}

      {canSeeWaiter && (
        <Tab.Screen
          name="Waiter"
          component={WaiterScreen}
          options={{ title: 'Garson' }}
        />
      )}

      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ title: 'Siparişler' }}
      />
    </Tab.Navigator>
  );
}