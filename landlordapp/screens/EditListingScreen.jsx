import {
    Image, ScrollView, Text, TextInput, TouchableOpacity,
    View, ActivityIndicator, Alert, Pressable
} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, Camera, X } from 'lucide-react-native'
import * as ImagePicker from 'expo-image-picker'
import api, { UPLOADS_URL } from '../utils/api'

const TYPES = [
    { label: 'Bedsitter', value: 'bedsitter' },
    { label: 'Studio', value: 'studio' },
    { label: '1 Bedroom', value: '1bedroom' },
    { label: '2 Bedroom', value: '2bedroom' },
    { label: '3 Bedroom', value: '3bedroom' },
    { label: 'Maisonette', value: 'maisonette' },
]

const FormInput = ({ label, value, onChangeText, placeholder, keyboardType = 'default', multiline = false }) => (
    <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">{label}</Text>
        <TextInput
            className={`bg-gray-50 border border-gray-200 rounded-xl px-4 ${multiline ? 'py-3 min-h-[80px]' : 'py-3'} text-gray-800`}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#94a3b8"
            keyboardType={keyboardType}
            multiline={multiline}
            textAlignVertical={multiline ? 'top' : 'auto'}
        />
    </View>
)

const EditListingScreen = ({ route, navigation }) => {
    const { apartment } = route.params

    const [title, setTitle] = useState(apartment.title || '')
    const [description, setDescription] = useState(apartment.description || '')
    const [price, setPrice] = useState(String(apartment.price || ''))
    const [location, setLocation] = useState(apartment.location || '')
    const [type, setType] = useState(apartment.type || 'studio')
    const [bedrooms, setBedrooms] = useState(String(apartment.bedrooms || '1'))
    const [bathrooms, setBathrooms] = useState(String(apartment.bathrooms || '1'))
    const [garages, setGarages] = useState(String(apartment.garages || '0'))
    // existing images are server filenames; new ones are local URI objects
    const [existingImages, setExistingImages] = useState(apartment.images || [])
    const [newImages, setNewImages] = useState([])
    const [loading, setLoading] = useState(false)

    const totalImages = existingImages.length + newImages.length

    const pickImages = async () => {
        if (totalImages >= 6) return Alert.alert('Limit reached', 'Maximum 6 images allowed')
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') return Alert.alert('Permission needed', 'Please allow access to your photo library')
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 6 - totalImages,
            quality: 0.8,
        })
        if (!result.canceled) {
            setNewImages(prev => [...prev, ...result.assets].slice(0, 6 - existingImages.length))
        }
    }

    const removeExisting = (filename) => {
        setExistingImages(prev => prev.filter(f => f !== filename))
    }

    const removeNew = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleSave = async () => {
        if (!title.trim() || !price || !location.trim()) {
            return Alert.alert('Missing fields', 'Title, price, and location are required')
        }
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('title', title.trim())
            formData.append('description', description.trim())
            formData.append('price', price)
            formData.append('location', location.trim())
            formData.append('type', type)
            formData.append('bedrooms', bedrooms)
            formData.append('bathrooms', bathrooms)
            formData.append('garages', garages)
            // send updated existing images list as JSON string
            formData.append('existingImages', JSON.stringify(existingImages))

            newImages.forEach((img) => {
                const filename = img.uri.split('/').pop()
                const match = /\.(\w+)$/.exec(filename)
                const mimeType = match ? `image/${match[1]}` : 'image/jpeg'
                formData.append('images', { uri: img.uri, name: filename, type: mimeType })
            })

            await api.put(`/apartments/${apartment.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            Alert.alert('Success', 'Listing updated!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ])
        } catch (err) {
            Alert.alert('Error', err?.response?.data?.message || 'Failed to update listing')
        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row items-center px-5 py-4 border-b border-gray-100">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
                    <ArrowLeft size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900">Edit Listing</Text>
            </View>

            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                <View className="pt-4">
                    <FormInput label="Property Title *" value={title} onChangeText={setTitle} placeholder="e.g. Modern 2BR in Westlands" />
                    <FormInput label="Description" value={description} onChangeText={setDescription} placeholder="Describe your property..." multiline />
                    <FormInput label="Location *" value={location} onChangeText={setLocation} placeholder="e.g. Westlands, Nairobi" />
                    <FormInput label="Monthly Rent (KES) *" value={price} onChangeText={setPrice} placeholder="e.g. 35000" keyboardType="numeric" />

                    {/* Type selector */}
                    <View className="mb-4">
                        <Text className="text-sm font-medium text-gray-700 mb-2">Property Type</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {TYPES.map((t) => (
                                <Pressable
                                    key={t.value}
                                    onPress={() => setType(t.value)}
                                    className={`mr-2 px-4 py-2 rounded-full border ${type === t.value ? 'bg-blue-700 border-blue-700' : 'bg-white border-gray-200'}`}
                                >
                                    <Text className={`text-sm font-medium ${type === t.value ? 'text-white' : 'text-gray-600'}`}>{t.label}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Rooms */}
                    <View className="flex-row space-x-3 mb-4">
                        <View className="flex-1">
                            <Text className="text-sm font-medium text-gray-700 mb-1">Bedrooms</Text>
                            <TextInput className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800" value={bedrooms} onChangeText={setBedrooms} keyboardType="numeric" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm font-medium text-gray-700 mb-1">Bathrooms</Text>
                            <TextInput className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800" value={bathrooms} onChangeText={setBathrooms} keyboardType="numeric" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm font-medium text-gray-700 mb-1">Garages</Text>
                            <TextInput className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800" value={garages} onChangeText={setGarages} keyboardType="numeric" />
                        </View>
                    </View>

                    {/* Images */}
                    <View className="mb-6">
                        <Text className="text-sm font-medium text-gray-700 mb-2">Photos ({totalImages}/6)</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <TouchableOpacity
                                onPress={pickImages}
                                className="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl items-center justify-center mr-3"
                            >
                                <Camera size={28} color="#94a3b8" />
                                <Text className="text-xs text-gray-400 mt-1">Add</Text>
                            </TouchableOpacity>

                            {/* Existing server images */}
                            {existingImages.map((filename, i) => (
                                <View key={`ex-${i}`} className="mr-3 relative">
                                    <Image
                                        source={{ uri: `${UPLOADS_URL}/${filename}` }}
                                        className="w-24 h-24 rounded-2xl"
                                        resizeMode="cover"
                                    />
                                    <TouchableOpacity
                                        onPress={() => removeExisting(filename)}
                                        className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5"
                                    >
                                        <X size={14} color="white" />
                                    </TouchableOpacity>
                                </View>
                            ))}

                            {/* New local images */}
                            {newImages.map((img, i) => (
                                <View key={`new-${i}`} className="mr-3 relative">
                                    <Image
                                        source={{ uri: img.uri }}
                                        className="w-24 h-24 rounded-2xl"
                                        resizeMode="cover"
                                    />
                                    <TouchableOpacity
                                        onPress={() => removeNew(i)}
                                        className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5"
                                    >
                                        <X size={14} color="white" />
                                    </TouchableOpacity>
                                    <View className="absolute bottom-1 left-1 bg-green-600 rounded px-1">
                                        <Text className="text-white text-xs">New</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={loading}
                        className="bg-blue-700 py-4 rounded-2xl mb-8 items-center"
                    >
                        {loading
                            ? <ActivityIndicator color="white" />
                            : <Text className="text-white font-bold text-lg">Save Changes</Text>
                        }
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default EditListingScreen
