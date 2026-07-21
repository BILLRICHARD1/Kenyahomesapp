import { View, Text, Animated, Easing } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { House } from 'lucide-react-native'
import { useUser } from '../context/UserContext'

const SplashScreen = () => {
  const navigation = useNavigation()
  const { user, loading } = useUser()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.3)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 1000, easing: Easing.elastic(1), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start()
  }, [])

  useEffect(() => {
    if (loading) return
    const timer = setTimeout(() => {
      if (user) {
        navigation.replace('Main')
      } else {
        navigation.replace('Login')
      }
    }, 2200)
    return () => clearTimeout(timer)
  }, [loading, user])

  return (
    <LinearGradient colors={['#22c55e', '#16a34a']} className="flex-1 justify-center items-center">
      <Animated.View
        style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }, { translateY: slideAnim }] }}
        className="items-center"
      >
        <View className="w-24 h-24 bg-white rounded-2xl justify-center items-center mb-6 shadow-lg">
          <House size={48} color="#22c55e" />
        </View>
        <Text className="text-white text-3xl font-bold mb-2">Kenya Homes</Text>
        <Text className="text-white/80 text-lg">Find your perfect home</Text>
        <View className="mt-8 flex-row space-x-2">
          {[0, 1, 2].map((i) => (
            <Animated.View key={i} style={{ opacity: fadeAnim }} className="w-2 h-2 bg-white rounded-full" />
          ))}
        </View>
      </Animated.View>
    </LinearGradient>
  )
}

export default SplashScreen
