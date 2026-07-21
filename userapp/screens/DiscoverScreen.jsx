import { Image, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Pressable } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Bed, Car, MapPin, Search, ShowerHead, SlidersHorizontal, Star, X } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import api, { UPLOADS_URL } from '../utils/api'
import { categories } from '../utils/data'

const TYPES = [
    { label: 'All', value: null },
    { label: 'Bedsitter', value: 'bedsitter' },
    { label: 'Studio', value: 'studio' },
    { label: '1 Bedroom', value: '1bedroom' },
    { label: '2 Bedroom', value: '2bedroom' },
    { label: '3 Bedroom', value: '3bedroom' },
    { label: 'Maisonette', value: 'maisonette' },
]

const DiscoverScreen = () => {
    const [searchText, setSearchText] = useState('')
    const [selectedType, setSelectedType] = useState(null)
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    const [apartments, setApartments] = useState([])
    const [loading, setLoading] = useState(false)
    const [showFilters, setShowFilters] = useState(false)
    const navigation = useNavigation()

    const search = useCallback(async () => {
        setLoading(true)
        try {
            const params = {}
            if (searchText) params.search = searchText
            if (selectedType) params.type = selectedType
            if (minPrice) params.minPrice = minPrice
            if (maxPrice) params.maxPrice = maxPrice
            const res = await api.get('/apartments', { params })
            setApartments(res.data.apartments || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [searchText, selectedType, minPrice, maxPrice])

    useEffect(() => {
        const timer = setTimeout(search, 500)
        return () => clearTimeout(timer)
    }, [search])

    const clearFilters = () => {
        setSelectedType(null)
        setMinPrice('')
        setMaxPrice('')
    }

    const getImageUri = (apt) => {
        if (apt.images && apt.images.length > 0) return { uri: `${UPLOADS_URL}/${apt.images[0]}` }
        return require('../assets/images/house1.jpeg')
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-5 pt-4 pb-2">
                <Text className="text-2xl font-bold text-gray-900 mb-4">Discover</Text>
                {/* Search bar */}
                <View className="flex-row items-center bg-slate-100 rounded-2xl px-4 py-3 border border-slate-200 mb-3">
                    <Search size={20} color="#64748b" />
                    <TextInput
                        className="flex-1 ml-3 text-base text-gray-700"
                        placeholder="Search by name, location..."
                        placeholderTextColor="#94a3b8"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                    {searchText ? (
                        <TouchableOpacity onPress={() => setSearchText('')}>
                            <X size={18} color="#94a3b8" />
                        </TouchableOpacity>
                    ) : null}
                </View>

                {/* Filter toggle */}
                <TouchableOpacity
                    onPress={() => setShowFilters(!showFilters)}
                    className="flex-row items-center space-x-2 self-start mb-2"
                >
                    <SlidersHorizontal size={18} color="#16a34a" />
                    <Text className="text-green-600 font-medium text-sm">
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Text>
                </TouchableOpacity>

                {/* Filters panel */}
                {showFilters && (
                    <View className="bg-slate-50 rounded-2xl p-4 mb-3">
                        <Text className="font-semibold text-gray-700 mb-2">Property Type</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
                            {TYPES.map((t) => (
                                <Pressable
                                    key={t.label}
                                    onPress={() => setSelectedType(t.value)}
                                    className={`mr-2 px-3 py-1.5 rounded-full border ${selectedType === t.value ? 'bg-green-500 border-green-500' : 'bg-white border-gray-200'}`}
                                >
                                    <Text className={`text-xs font-medium ${selectedType === t.value ? 'text-white' : 'text-gray-600'}`}>{t.label}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>

                        <Text className="font-semibold text-gray-700 mb-2">Price Range (KES)</Text>
                        <View className="flex-row space-x-2">
                            <TextInput
                                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm"
                                placeholder="Min price"
                                value={minPrice}
                                onChangeText={setMinPrice}
                                keyboardType="numeric"
                            />
                            <TextInput
                                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm"
                                placeholder="Max price"
                                value={maxPrice}
                                onChangeText={setMaxPrice}
                                keyboardType="numeric"
                            />
                        </View>
                        {(selectedType || minPrice || maxPrice) ? (
                            <TouchableOpacity onPress={clearFilters} className="mt-2 self-start">
                                <Text className="text-red-500 text-sm">Clear filters</Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                )}
            </View>

            {/* Results */}
            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                {loading ? (
                    <ActivityIndicator size="large" color="#16a34a" className="mt-10" />
                ) : apartments.length === 0 ? (
                    <View className="items-center mt-16">
                        <Text className="text-4xl mb-3">🏠</Text>
                        <Text className="text-gray-500 text-base font-medium">No results found</Text>
                        <Text className="text-gray-400 text-sm mt-1">Try a different search or filter</Text>
                    </View>
                ) : (
                    <>
                        <Text className="text-gray-400 text-sm mb-3">{apartments.length} apartments found</Text>
                        {apartments.map((apt) => (
                            <TouchableOpacity
                                key={apt.id}
                                onPress={() => navigation.navigate('View', { apartmentId: apt.id })}
                                className="flex-row bg-white rounded-2xl border border-neutral-100 shadow-sm mb-4 overflow-hidden"
                                style={{ height: 110 }}
                            >
                                <Image
                                    source={getImageUri(apt)}
                                    style={{ width: 110, height: 110 }}
                                    resizeMode="cover"
                                />
                                <View className="flex-1 p-3 justify-between">
                                    <Text className="font-bold text-gray-900" numberOfLines={1}>{apt.title}</Text>
                                    <View className="flex-row items-center space-x-1">
                                        <MapPin size={12} color="#94a3b8" />
                                        <Text className="text-gray-400 text-xs" numberOfLines={1}>{apt.location}</Text>
                                    </View>
                                    <Text className="text-green-600 font-bold text-sm">
                                        KES {Number(apt.price).toLocaleString()}/mo
                                    </Text>
                                    <View className="flex-row items-center space-x-3">
                                        <View className="flex-row items-center space-x-1">
                                            <Bed size={12} color="#94a3b8" />
                                            <Text className="text-xs text-gray-400">{apt.bedrooms}bd</Text>
                                        </View>
                                        <View className="flex-row items-center space-x-1">
                                            <ShowerHead size={12} color="#94a3b8" />
                                            <Text className="text-xs text-gray-400">{apt.bathrooms}ba</Text>
                                        </View>
                                        <View className="flex-row items-center space-x-1">
                                            <Star size={12} fill="#eab308" color="#eab308" />
                                            <Text className="text-xs text-gray-400">{apt.rating || '—'}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default DiscoverScreen
