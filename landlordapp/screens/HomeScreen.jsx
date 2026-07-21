import { Image, ScrollView, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl, Alert } from 'react-native'
import React, { useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Bed, Car, MapPin, Plus, ShowerHead, Trash2, Edit3, ToggleLeft, ToggleRight } from 'lucide-react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import api, { UPLOADS_URL } from '../utils/api'
import { useUser } from '../context/UserContext'

const HomeScreen = () => {
  const [apartments, setApartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const navigation = useNavigation()
  const { user, refreshProfile } = useUser()
  console.log("user", user)

  const fetchListings = async () => {
    try {
      const res = await api.get('/apartments/landlord/my')
      setApartments(res.data.apartments || [])
    } catch (err) {
      console.error('fetchListings error:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useFocusEffect(useCallback(() => { fetchListings(), refreshProfile() }, []))

  const toggleAvailability = async (apt) => {
    try {
      await api.put(`/apartments/${apt.id}`, { isAvailable: !apt.isAvailable })
      setApartments(prev => prev.map(a => a.id === apt.id ? { ...a, isAvailable: !a.isAvailable } : a))
    } catch (err) {
      Alert.alert('Error', 'Failed to update availability')
    }
  }

  const deleteApartment = (apt) => {
    Alert.alert(
      'Delete Listing',
      `Delete "${apt.title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/apartments/${apt.id}`)
              setApartments(prev => prev.filter(a => a.id !== apt.id))
            } catch (err) {
              Alert.alert('Error', 'Failed to delete listing')
            }
          }
        }
      ]
    )
  }

  const getImageUri = (apt) => {
    if (apt.images && apt.images.length > 0) return { uri: `${UPLOADS_URL}/${apt.images[0]}` }
    return require('../assets/images/house1.jpeg')
  }

  const activeCount = apartments.filter(a => a.isAvailable).length

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchListings() }} tintColor="#1d4ed8" />}
      >
        <View className="px-5 pt-4 pb-2">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-2xl font-bold text-gray-900">My Listings</Text>
              <Text className="text-gray-400 text-sm">Hello, {user?.username}</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddListing')}
              className="bg-blue-700 flex-row items-center space-x-2 px-4 py-2.5 rounded-2xl"
            >
              <Plus size={18} color="white" />
              <Text className="text-white font-semibold text-sm">Add New</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View className="flex-row space-x-3 mb-5">
            <View className="flex-1 bg-blue-50 rounded-2xl p-4">
              <Text className="text-2xl font-bold text-blue-700">{apartments.length}</Text>
              <Text className="text-xs text-blue-500 mt-1">Total Listings</Text>
            </View>
            <View className="flex-1 bg-green-50 rounded-2xl p-4">
              <Text className="text-2xl font-bold text-green-700">{activeCount}</Text>
              <Text className="text-xs text-green-500 mt-1">Active</Text>
            </View>
            <View className="flex-1 bg-orange-50 rounded-2xl p-4">
              <Text className="text-2xl font-bold text-orange-600">{apartments.length - activeCount}</Text>
              <Text className="text-xs text-orange-400 mt-1">Inactive</Text>
            </View>
          </View>
        </View>

        <View className="px-5">
          {loading ? (
            <ActivityIndicator size="large" color="#1d4ed8" className="mt-10" />
          ) : apartments.length === 0 ? (
            <View className="items-center mt-16">
              <Text className="text-5xl mb-4">🏗️</Text>
              <Text className="text-gray-700 font-bold text-lg mb-2">No listings yet</Text>
              <Text className="text-gray-400 text-center mb-6">Tap "Add New" to post your first property</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('AddListing')}
                className="bg-blue-700 px-8 py-3 rounded-2xl"
              >
                <Text className="text-white font-semibold">Post a Listing</Text>
              </TouchableOpacity>
            </View>
          ) : (
            apartments.map((apt) => (
              <View key={apt.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm mb-4 overflow-hidden">
                <Image
                  source={getImageUri(apt)}
                  style={{ width: '100%', height: 160 }}
                  resizeMode="cover"
                />
                {/* Availability badge */}
                <View className={`absolute top-3 left-3 px-3 py-1 rounded-full ${apt.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}>
                  <Text className="text-white text-xs font-semibold">{apt.isAvailable ? 'Active' : 'Inactive'}</Text>
                </View>

                <View className="p-4">
                  <View className="flex-row justify-between items-start mb-1">
                    <Text className="font-bold text-gray-900 text-base flex-1 pr-2" numberOfLines={1}>{apt.title}</Text>
                    <Text className="text-green-600 font-bold text-sm">KES {Number(apt.price).toLocaleString()}</Text>
                  </View>

                  <View className="flex-row items-center space-x-1 mb-3">
                    <MapPin size={13} color="#94a3b8" />
                    <Text className="text-gray-400 text-xs">{apt.location}</Text>
                  </View>

                  <View className="flex-row items-center space-x-4 mb-3">
                    <View className="flex-row items-center space-x-1">
                      <Bed size={13} color="#94a3b8" />
                      <Text className="text-xs text-gray-400">{apt.bedrooms} bd</Text>
                    </View>
                    <View className="flex-row items-center space-x-1">
                      <ShowerHead size={13} color="#94a3b8" />
                      <Text className="text-xs text-gray-400">{apt.bathrooms} ba</Text>
                    </View>
                    <View className="flex-row items-center space-x-1">
                      <Car size={13} color="#94a3b8" />
                      <Text className="text-xs text-gray-400">{apt.garages} garage</Text>
                    </View>
                  </View>

                  {/* Action buttons */}
                  <View className="flex-row space-x-2">
                    <TouchableOpacity
                      onPress={() => navigation.navigate('EditListing', { apartment: apt })}
                      className="flex-1 flex-row items-center justify-center space-x-1 border border-blue-200 py-2 rounded-xl"
                    >
                      <Edit3 size={14} color="#1d4ed8" />
                      <Text className="text-blue-700 text-sm font-medium">Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => toggleAvailability(apt)}
                      className={`flex-1 flex-row items-center justify-center space-x-1 border py-2 rounded-xl ${apt.isAvailable ? 'border-orange-200' : 'border-green-200'}`}
                    >
                      {apt.isAvailable
                        ? <ToggleRight size={14} color="#f97316" />
                        : <ToggleLeft size={14} color="#16a34a" />
                      }
                      <Text className={`text-sm font-medium ${apt.isAvailable ? 'text-orange-500' : 'text-green-600'}`}>
                        {apt.isAvailable ? 'Deactivate' : 'Activate'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => deleteApartment(apt)}
                      className="border border-red-200 p-2 rounded-xl"
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen
