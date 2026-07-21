import { View, Text, Animated, Easing } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { Building2 } from 'lucide-react-native'
import { useUser } from '../context/UserContext'

const SplashScreen = () => {
  const navigation = useNavigation()
  const { user, loading } = useUser()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 1000, easing: Easing.elastic(1), useNativeDriver: true }),
    ]).start()
  }, [])

  useEffect(() => {
    if (loading) return
    const timer = setTimeout(() => {
      navigation.replace(user ? 'Main' : 'Login')
    }, 2200)
    return () => clearTimeout(timer)
  }, [loading, user])

  return (
    <LinearGradient colors={['#1d4ed8', '#1e40af']} className="flex-1 justify-center items-center">
      <Animated.View
        style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
        className="items-center"
      >
        <View className="w-24 h-24 bg-white rounded-2xl justify-center items-center mb-6 shadow-lg">
          <Building2 size={48} color="#1d4ed8" />
        </View>
        <Text className="text-white text-3xl font-bold mb-2">Kenya Homes</Text>
        <Text className="text-white/80 text-lg">Landlord Portal</Text>
      </Animated.View>
    </LinearGradient>
  )
}

export default SplashScreen
