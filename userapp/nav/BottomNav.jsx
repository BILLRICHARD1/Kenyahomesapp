import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Home, Search, UserCircle2 } from 'lucide-react-native'
import { Heart } from 'react-native-feather'
import HomeScreen from '../screens/HomeScreen'
import DiscoverScreen from '../screens/DiscoverScreen'
import WishList from '../screens/WishList'
import ProfileScreen from '../screens/ProfileScreen'

const Tab = createBottomTabNavigator()

const BottomNav = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <Home size={22} color={focused ? '#22c55e' : '#9ca3af'} /> }}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{ tabBarIcon: ({ focused }) => <Search size={22} color={focused ? '#22c55e' : '#9ca3af'} /> }}
      />
      {/* <Tab.Screen
        name="Wishlist"
        component={WishList}
        options={{ tabBarIcon: ({ focused }) => <Heart size={22} color={focused ? '#22c55e' : '#9ca3af'} stroke={focused ? '#22c55e' : '#9ca3af'} /> }}
      /> */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <UserCircle2 size={22} color={focused ? '#22c55e' : '#9ca3af'} /> }}
      />
    </Tab.Navigator>
  )
}

export default BottomNav
