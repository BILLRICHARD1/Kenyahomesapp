import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import BottomNav from './BottomNav';
import { UserProvider } from '../context/UserContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ViewScreen from '../screens/ViewScreen';
import WishList from '../screens/WishList';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="View" component={ViewScreen} options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="Wishlist" component={WishList} options={{ headerShown: true, presentation: 'modal' }} />
          <Stack.Screen name="Main" component={BottomNav} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

export default AppNavigator;
