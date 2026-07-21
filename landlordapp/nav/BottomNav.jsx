import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Home, UserCircle2 } from 'lucide-react-native'
import { PlusSquare } from 'react-native-feather'
import HomeScreen from '../screens/HomeScreen'
import ProfileScreen from '../screens/ProfileScreen'
import AddListingScreen from '../screens/AddListingScreen'

const Tab = createBottomTabNavigator()

const BottomNav = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#1d4ed8',
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
        name="MyListings"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Listings',
          tabBarIcon: ({ focused }) => <Home size={22} color={focused ? '#1d4ed8' : '#9ca3af'} />,
        }}
      />
      <Tab.Screen
        name="AddListing"
        component={AddListingScreen}
        options={{
          tabBarLabel: 'Post',
          tabBarIcon: ({ focused }) => <PlusSquare size={22} color={focused ? '#1d4ed8' : '#9ca3af'} stroke={focused ? '#1d4ed8' : '#9ca3af'} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => <UserCircle2 size={22} color={focused ? '#1d4ed8' : '#9ca3af'} />,
        }}
      />
    </Tab.Navigator>
  )
}

export default BottomNav
