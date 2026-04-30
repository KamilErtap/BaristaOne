import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MenuScreen from '../screens/MenuScreen';

const Tab = createBottomTabNavigator();

export default function CustomerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#8b5e3c',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e2e8f0',
        },
      }}
    >
      <Tab.Screen name="Menu" component={MenuScreen} />
    </Tab.Navigator>
  );
}