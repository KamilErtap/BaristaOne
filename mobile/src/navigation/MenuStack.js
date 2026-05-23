import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuScreen from '../screens/MenuScreen';
import MenuDetailScreen from '../screens/MenuDetailScreen';

const Stack = createNativeStackNavigator();

export default function MenuStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MenuList" component={MenuScreen} />
      <Stack.Screen name="MenuDetail" component={MenuDetailScreen} />
    </Stack.Navigator>
  );
}