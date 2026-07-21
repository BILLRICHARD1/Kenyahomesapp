import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import BottomNav from './BottomNav';
import { UserProvider } from '../context/UserContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import EditListingScreen from '../screens/EditListingScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="Main" component={BottomNav} options={{ headerShown: false }} />
          <Stack.Screen name="EditListing" component={EditListingScreen} options={{ headerShown: false, presentation: 'modal' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

export default AppNavigator;
