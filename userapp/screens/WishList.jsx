import { Image, ScrollView, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Bed, Heart, MapPin, ShowerHead, Trash2 } from 'lucide-react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import api, { UPLOADS_URL } from '../utils/api'
import { useUser } from '../context/UserContext'

const WishList = () => {
    const [wishlist, setWishlist] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const navigation = useNavigation()
    const { user } = useUser()

    const fetchWishlist = async () => {
        if (!user) { setLoading(false); return }
        try {
            const res = await api.get('/wishlist')
            setWishlist(res.data.wishlist || [])
        } catch (err) {
            console.error('fetchWishlist error:', err)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useFocusEffect(useCallback(() => { fetchWishlist() }, [user]))

    const removeFromWishlist = async (apartmentId) => {
        try {
            await api.delete(`/wishlist/${apartmentId}`)
            setWishlist(prev => prev.filter(w => w.apartmentId !== apartmentId))
        } catch (err) {
            console.error('removeFromWishlist error:', err)
        }
    }

    const getImageUri = (apt) => {
        if (apt?.images?.length > 0) return { uri: `${UPLOADS_URL}/${apt.images[0]}` }
        return require('../assets/images/house1.jpeg')
    }

    if (!user) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center px-8">
                <Heart size={60} color="#d1d5db" />
                <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">Your wishlist is empty</Text>
                <Text className="text-gray-400 text-center mb-6">Sign in to save your favourite apartments</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    className="bg-green-500 px-8 py-3 rounded-2xl"
                >
                    <Text className="text-white font-semibold">Sign In</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-5 pt-4 pb-2">
                <Text className="text-2xl font-bold text-gray-900">Saved Homes</Text>
                <Text className="text-gray-400 text-sm mt-1">{wishlist.length} saved</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#16a34a" className="mt-20" />
            ) : wishlist.length === 0 ? (
                <View className="flex-1 items-center justify-center px-8">
                    <Heart size={60} color="#d1d5db" />
                    <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">Nothing saved yet</Text>
                    <Text className="text-gray-400 text-center mb-6">Tap the heart on any listing to save it here</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Home')}
                        className="bg-green-500 px-8 py-3 rounded-2xl"
                    >
                        <Text className="text-white font-semibold">Browse Homes</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView
                    className="flex-1 px-5"
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchWishlist() }} tintColor="#16a34a" />}
                >
                    {wishlist.map((item) => {
                        const apt = item.apartment
                        if (!apt) return null
                        return (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => navigation.navigate('View', { apartmentId: apt.id })}
                                className="bg-white rounded-2xl border border-neutral-100 shadow-sm mb-4 overflow-hidden"
                            >
                                <Image
                                    source={getImageUri(apt)}
                                    style={{ width: '100%', height: 160 }}
                                    resizeMode="cover"
                                />
                                <View className="p-4">
                                    <View className="flex-row justify-between items-start">
                                        <View className="flex-1 pr-2">
                                            <Text className="font-bold text-gray-900 text-base mb-1" numberOfLines={1}>{apt.title}</Text>
                                            <View className="flex-row items-center space-x-1 mb-1">
                                                <MapPin size={13} color="#94a3b8" />
                                                <Text className="text-gray-400 text-xs">{apt.location}</Text>
                                            </View>
                                            <Text className="text-green-600 font-bold">
                                                KES {Number(apt.price).toLocaleString()}/mo
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => removeFromWishlist(apt.id)}
                                            className="p-2"
                                        >
                                            <Trash2 size={20} color="#ef4444" />
                                        </TouchableOpacity>
                                    </View>
                                    <View className="flex-row items-center space-x-3 mt-2">
                                        <View className="flex-row items-center space-x-1">
                                            <Bed size={13} color="#94a3b8" />
                                            <Text className="text-xs text-gray-400">{apt.bedrooms} bd</Text>
                                        </View>
                                        <View className="flex-row items-center space-x-1">
                                            <ShowerHead size={13} color="#94a3b8" />
                                            <Text className="text-xs text-gray-400">{apt.bathrooms} ba</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            )}
        </SafeAreaView>
    )
}

export default WishList
