import {
    Image, ScrollView, Text, View, TouchableOpacity, ActivityIndicator,
    Alert, Linking, Dimensions, FlatList
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, Bed, Car, Heart, MapPin, Phone, ShowerHead, Star } from 'lucide-react-native'
import api, { UPLOADS_URL } from '../utils/api'
import { useUser } from '../context/UserContext'

const { width } = Dimensions.get('window')

const ViewScreen = ({ route, navigation }) => {
    const { apartmentId } = route.params
    const { user } = useUser()
    const [apartment, setApartment] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeImage, setActiveImage] = useState(0)
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [wishlistLoading, setWishlistLoading] = useState(false)
    const [phoneData, setPhoneData] = useState(null)
    const [payLoading, setPayLoading] = useState(false)

    useEffect(() => {
        fetchApartment()
        checkWishlist()
    }, [apartmentId])

    const fetchApartment = async () => {
        try {
            const res = await api.get(`/apartments/${apartmentId}`)
            setApartment(res.data)
            if (res.data.phoneVisible) {
                setPhoneData({ phone: res.data.landlord?.phone, landlord: res.data.landlord?.username })
            }
        } catch (err) {
            console.error('fetchApartment error:', err)
            Alert.alert('Error', 'Could not load apartment details')
            navigation.goBack()
        } finally {
            setLoading(false)
        }
    }

    const checkWishlist = async () => {
        try {
            const res = await api.get('/wishlist')
            const ids = res.data.wishlist.map(w => w.apartmentId)
            setIsWishlisted(ids.includes(parseInt(apartmentId)))
        } catch { }
    }

    const toggleWishlist = async () => {
        if (!user) return Alert.alert('Sign in required', 'Please log in to save apartments')
        setWishlistLoading(true)
        try {
            if (isWishlisted) {
                await api.delete(`/wishlist/${apartmentId}`)
                setIsWishlisted(false)
            } else {
                await api.post(`/wishlist/${apartmentId}`)
                setIsWishlisted(true)
            }
        } catch (err) {
            Alert.alert('Error', err?.response?.data?.message || 'Failed to update wishlist')
        } finally {
            setWishlistLoading(false)
        }
    }

    const handleRevealContact = async () => {
        if (!user) return Alert.alert('Sign in required', 'Please log in to view contact details')
        Alert.alert(
            'Reveal Contact',
            'You will be charged KES 100 to view the landlord\'s phone number. Proceed?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Pay KES 100',
                    onPress: async () => {
                        setPayLoading(true)
                        try {
                            const res = await api.post(`/payments/reveal/${apartmentId}`)
                            setPhoneData({ phone: res.data.phone, landlord: res.data.landlord })
                            if (!res.data.alreadyPaid) {
                                Alert.alert('Success', 'Contact unlocked successfully!')
                            }
                        } catch (err) {
                            Alert.alert('Error', err?.response?.data?.message || 'Payment failed')
                        } finally {
                            setPayLoading(false)
                        }
                    }
                }
            ]
        )
    }

    const callLandlord = () => {
        if (phoneData?.phone) {
            Linking.openURL(`tel:${phoneData.phone}`)
        }
    }

    const getImageUri = (filename) => ({ uri: `${UPLOADS_URL}/${filename}` })

    const images = apartment?.images?.length > 0
        ? apartment.images.map(getImageUri)
        : [require('../assets/images/house1.jpeg')]

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#16a34a" />
            </View>
        )
    }

    if (!apartment) return null

    return (
        <View className="flex-1 bg-white">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image Gallery */}
                <View style={{ height: 300 }}>
                    <FlatList
                        data={images}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={(e) => {
                            const idx = Math.round(e.nativeEvent.contentOffset.x / width)
                            setActiveImage(idx)
                        }}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={({ item }) => (
                            <Image source={item} style={{ width, height: 300 }} resizeMode="cover" />
                        )}
                    />
                    {/* Image dots */}
                    {images.length > 1 && (
                        <View className="absolute bottom-4 left-0 right-0 flex-row justify-center space-x-1">
                            {images.map((_, i) => (
                                <View key={i} className={`rounded-full ${i === activeImage ? 'w-4 h-2 bg-white' : 'w-2 h-2 bg-white/50'}`} />
                            ))}
                        </View>
                    )}
                </View>

                {/* Back & Wishlist overlay buttons */}
                <View className="absolute top-12 left-0 right-0 flex-row justify-between px-4">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="bg-white/90 rounded-full p-2 shadow"
                    >
                        <ArrowLeft size={22} color="#1e293b" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={toggleWishlist}
                        disabled={wishlistLoading}
                        className="bg-white/90 rounded-full p-2 shadow"
                    >
                        <Heart
                            size={22}
                            color={isWishlisted ? '#ef4444' : '#94a3b8'}
                            fill={isWishlisted ? '#ef4444' : 'transparent'}
                        />
                    </TouchableOpacity>
                </View>

                {/* Details */}
                <View className="px-5 pt-5 pb-10">
                    {/* Title & Price */}
                    <View className="flex-row justify-between items-start mb-2">
                        <Text className="text-2xl font-bold text-gray-900 flex-1 pr-2">{apartment.title}</Text>
                        <View className="flex-row items-center space-x-1 bg-green-50 px-2 py-1 rounded-lg">
                            <Star fill="#eab308" size={14} color="#eab308" />
                            <Text className="text-sm font-semibold text-gray-700">{apartment.rating || '—'}</Text>
                        </View>
                    </View>

                    <Text className="text-2xl font-bold text-green-600 mb-1">
                        KES {Number(apartment.price).toLocaleString()}
                        <Text className="text-sm font-normal text-gray-400"> / month</Text>
                    </Text>

                    <View className="flex-row items-center space-x-1 mb-5">
                        <MapPin size={16} color="#94a3b8" />
                        <Text className="text-gray-500">{apartment.location}</Text>
                    </View>

                    {/* Specs */}
                    <View className="flex-row space-x-3 mb-6">
                        <View className="flex-1 bg-slate-50 rounded-2xl p-4 items-center">
                            <Bed size={22} color="#16a34a" />
                            <Text className="font-bold text-lg mt-1">{apartment.bedrooms}</Text>
                            <Text className="text-xs text-gray-400">Bedrooms</Text>
                        </View>
                        <View className="flex-1 bg-slate-50 rounded-2xl p-4 items-center">
                            <ShowerHead size={22} color="#16a34a" />
                            <Text className="font-bold text-lg mt-1">{apartment.bathrooms}</Text>
                            <Text className="text-xs text-gray-400">Bathrooms</Text>
                        </View>
                        <View className="flex-1 bg-slate-50 rounded-2xl p-4 items-center">
                            <Car size={22} color="#16a34a" />
                            <Text className="font-bold text-lg mt-1">{apartment.garages}</Text>
                            <Text className="text-xs text-gray-400">Garages</Text>
                        </View>
                    </View>

                    {/* Description */}
                    {apartment.description ? (
                        <View className="mb-6">
                            <Text className="font-semibold text-lg mb-2">About this property</Text>
                            <Text className="text-gray-500 leading-6">{apartment.description}</Text>
                        </View>
                    ) : null}

                    {/* Type badge */}
                    <View className="mb-6">
                        <Text className="font-semibold text-lg mb-2">Property Type</Text>
                        <View className="bg-green-50 self-start px-4 py-2 rounded-full">
                            <Text className="text-green-700 font-medium capitalize">{apartment.type}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={toggleWishlist}
                        disabled={wishlistLoading}
                        className={`${!isWishlisted ? "bg-green-400" : "bg-white border border-green-400"} flex space-x-2 flex-row justify-center items-center rounded-xl w-full h-12 p-2 shadow`}
                    >
                        <Text className={`${!isWishlisted ? "text-white" : "text-green-400"} text-lg`}>{isWishlisted ? "Wishlisted" : "Add to Wishlist"}</Text>
                        <Heart
                            size={22}
                            className={`${!isWishlisted ? "text-white" : "text-green-400"}`}
                            // color={isWishlisted ? '#ef4444' : '#94a3b8'}
                            fill={isWishlisted ? 'green' : 'transparent'}
                        />
                    </TouchableOpacity>

                    {/* Landlord / Contact section */}
                    <View className="bg-slate-50 rounded-2xl p-4 mb-4">
                        <Text className="font-semibold text-lg mb-3">Contact Landlord</Text>
                        {phoneData ? (
                            <View className="space-y-3">
                                <View className="flex-row items-center space-x-2">
                                    <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                                        <Text className="text-green-700 font-bold text-base">
                                            {phoneData.landlord?.[0]?.toUpperCase() || 'L'}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text className="font-semibold text-gray-800">{phoneData.landlord}</Text>
                                        <Text className="text-gray-500 text-sm">{phoneData.phone}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={callLandlord}
                                    className="bg-green-500 py-3 rounded-xl flex-row items-center justify-center space-x-2"
                                >
                                    <Phone size={18} color="white" />
                                    <Text className="text-white font-semibold">Call Now</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View className="space-y-3">
                                <Text className="text-gray-500 text-sm">
                                    Pay KES 100 to reveal the landlord's phone number and contact them directly.
                                </Text>
                                <TouchableOpacity
                                    onPress={handleRevealContact}
                                    disabled={payLoading}
                                    className="bg-[#16a34a] py-3 rounded-xl flex-row items-center justify-center space-x-2"
                                >
                                    {payLoading
                                        ? <ActivityIndicator color="white" size="small" />
                                        : <>
                                            <Phone size={18} color="white" />
                                            <Text className="text-white font-semibold">Reveal Contact — KES 100</Text>
                                        </>
                                    }
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default ViewScreen
