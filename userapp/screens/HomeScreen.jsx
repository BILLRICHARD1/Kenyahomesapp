import { Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Bed, Bell, Car, ChevronRight, HeartIcon, MapPin, Search, ShowerHead, Star } from 'lucide-react-native'
import { categories } from '../utils/data'
import { useNavigation } from '@react-navigation/native'
import { UPLOADS_URL } from '../utils/api'
import api from '../utils/api'
import { useUser } from '../context/UserContext'

const HomeScreen = () => {
  const [searchText, setSearchText] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [apartments, setApartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const navigation = useNavigation()
  const { user } = useUser()

  // console.log("user", user)

  const fetchApartments = useCallback(async (search = '', type = null) => {
    try {
      const params = {}
      if (search) params.search = search
      if (type) params.type = categoryToType(type)
      const res = await api.get('/apartments', { params })
      setApartments(res.data.apartments || [])
    } catch (err) {
      console.error('fetchApartments error:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchApartments()
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApartments(searchText, activeCategory)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchText, activeCategory])

  const onRefresh = () => {
    setRefreshing(true)
    fetchApartments(searchText, activeCategory)
  }

  const categoryToType = (catName) => {
    const map = {
      'Bedsitters': 'bedsitter',
      'Studio': 'studio',
      '1 Bedroom': '1bedroom',
      '2 Bedroom': '2bedroom',
      '3 Bedroom': '3bedroom',
      'Maisonette': 'maisonette',
    }
    return map[catName] || null
  }

  const getImageUri = (apt) => {
    if (apt.images && apt.images.length > 0) {
      return { uri: `${UPLOADS_URL}/${apt.images[0]}` }
    }
    return require('../assets/images/house1.jpeg')
  }

  const HouseCard = ({ house }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('View', { apartmentId: house.id })}
      className="w-full rounded-2xl border border-neutral-100 shadow-sm bg-white mb-5"
      style={{ height: 300 }}
    >
      <Image
        source={getImageUri(house)}
        className="w-full rounded-t-2xl"
        style={{ height: '60%' }}
        resizeMode="cover"
      />
      <View className="flex flex-row items-center py-4 justify-between px-3">
        <View className="flex flex-col space-y-1 flex-1 pr-2">
          <Text className="text-green-500 font-bold text-lg">
            Kes.{Number(house?.price).toLocaleString()} / <Text className="text-xs text-neutral-400">month</Text>
            {'  '}<Text className="text-xs text-neutral-500">{house?.type}</Text>
          </Text>
          <Text className="font-bold text-xl" numberOfLines={1}>{house?.title}</Text>
          <View className="flex flex-row items-center space-x-1">
            <MapPin size={14} color="#94a3b8" />
            <Text className="text-neutral-400 text-xs">{house?.location}</Text>
          </View>
        </View>
        <View className="flex flex-col items-end justify-end space-y-4">
          <View className="flex-row items-center space-x-1">
            <Star fill={'#eab308'} size={16} color="#eab308" />
            <Text className="text-xs">{house?.rating || '—'}</Text>
          </View>
          <View className="flex flex-row items-center space-x-3">
            <View className="flex flex-row items-center space-x-1">
              <ShowerHead size={14} color="#94a3b8" />
              <Text className="text-xs text-neutral-500">{house?.bathrooms}</Text>
            </View>
            <View className="flex flex-row items-center space-x-1">
              <Bed size={14} color="#94a3b8" />
              <Text className="text-xs text-neutral-500">{house?.bedrooms}</Text>
            </View>
            <View className="flex flex-row items-center space-x-1">
              <Car size={14} color="#94a3b8" />
              <Text className="text-xs text-neutral-500">{house?.garages}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )


  return (
    <SafeAreaView className="flex-1 bg-white px-5">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#16a34a" />}
      >
        {/* Header */}
        <View className="flex flex-row items-center justify-between pt-4">
          <View className="space-y-1 flex flex-col">
            <Text className="text-3xl font-semibold">Find Your Best{'\n'}Apartments</Text>
            <Text className="text-sm text-neutral-400">
              {user ? `Welcome, ${user.name}` : 'Discover places you would love to live in'}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Wishlist')}
              className="bg-slate-100 p-3 rounded-full justify-center items-center">
              <HeartIcon size={20} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View className="relative mb-4 mt-5">
          <View className="flex-row items-center bg-slate-100 rounded-3xl px-5 py-1 border border-slate-200">
            <Search size={22} color="#64748b" />
            <TextInput
              className="flex-1 ml-3 text-base text-gray-700"
              placeholder="Search apartments, locations..."
              placeholderTextColor="#94a3b8"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Categories */}
        <View className="py-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-3">
            <Pressable
              onPress={() => setActiveCategory(null)}
              className={`${!activeCategory ? 'bg-green-400 border-white' : 'bg-white border-neutral-300'} h-8 border rounded-full px-4 flex-row justify-center items-center mr-2`}
            >
              <Text className={`${!activeCategory ? 'text-white' : 'text-neutral-400'} text-xs font-medium`}>All</Text>
            </Pressable>
            {categories.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
                className={`${activeCategory === cat.name ? 'bg-green-400 border-white' : 'bg-white border-neutral-300'} h-8 border rounded-full px-4 flex-row justify-center items-center mr-2`}
              >
                <Text className={`${activeCategory === cat.name ? 'text-white' : 'text-neutral-400'} text-xs font-medium`}>{cat.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Listings */}
        <View className="w-full py-4">
          <View className="flex flex-row items-center justify-between mb-4">
            <Text className="font-semibold text-xl">
              {activeCategory || searchText ? 'Search Results' : 'Popular Houses'}
            </Text>
            {!loading && (
              <Text className="text-neutral-400 text-sm">{apartments.length} found</Text>
            )}
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#16a34a" className="mt-10" />
          ) : apartments.length === 0 ? (
            <View className="items-center mt-10">
              <Text className="text-neutral-400 text-base">No apartments found</Text>
              <Text className="text-neutral-300 text-sm mt-1">Try adjusting your search</Text>
            </View>
          ) : (
            <View className="space-y-5">
              {apartments.map((house) => (
                <HouseCard key={house.id} house={house} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen
