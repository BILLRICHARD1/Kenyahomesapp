import { ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { LogOut, User, Phone, Mail, Lock, ChevronRight, Shield } from 'lucide-react-native'
import { useUser } from '../context/UserContext'
import api from '../utils/api'

const ProfileScreen = () => {
    const { user, logout, updateProfile, restoreSession, refreshProfile } = useUser()
    const navigation = useNavigation()
    const [editMode, setEditMode] = useState(false)
    const [username, setUsername] = useState(user?.username || '')
    const [phone, setPhone] = useState(user?.phone || '')
    const [saving, setSaving] = useState(false)



    useEffect(() => {
        refreshProfile()
    }, [])



    // Password change
    const [showPwForm, setShowPwForm] = useState(false)
    const [currentPw, setCurrentPw] = useState('')
    const [newPw, setNewPw] = useState('')
    const [pwLoading, setPwLoading] = useState(false)

    const onRefresh = () => {
        refreshProfile()
        setPwLoading(false)
    }

    if (!user) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center px-8">
                <User size={60} color="#d1d5db" />
                <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">Not logged in</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    className="bg-green-500 px-8 py-3 rounded-2xl mt-4"
                >
                    <Text className="text-white font-semibold">Sign In</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }

    const handleSave = async () => {
        if (!username.trim() || !phone.trim()) {
            return Alert.alert('Error', 'Name and phone cannot be empty')
        }
        setSaving(true)
        try {
            await updateProfile(user.id, { username: username.trim(), phone: phone.trim() })
            setEditMode(false)
            Alert.alert('Success', 'Profile updated!')
        } catch (err) {
            Alert.alert('Error', err?.response?.data?.message || 'Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    const handlePasswordChange = async () => {
        if (!currentPw || !newPw) return Alert.alert('Error', 'Fill in both fields')
        if (newPw.length < 6) return Alert.alert('Error', 'New password must be at least 6 characters')
        setPwLoading(true)
        try {
            await api.post(`/users/passreset/${user.id}`, {
                currentpassword: currentPw,
                newpassword: newPw,
            })
            setCurrentPw('')
            setNewPw('')
            setShowPwForm(false)
            Alert.alert('Success', 'Password updated successfully')
        } catch (err) {
            Alert.alert('Error', err?.response?.data?.message || 'Failed to change password')
        } finally {
            setPwLoading(false)
        }
    }

    const handleLogout = () => {
        Alert.alert('Log out', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Log out',
                style: 'destructive',
                onPress: async () => {
                    await logout()
                    navigation.replace('Login')
                }
            }
        ])
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={pwLoading} onRefresh={onRefresh} tintColor="#16a34a" />}
            >
                <Text className="text-2xl font-bold text-gray-900 mt-4 mb-6">Profile</Text>

                {/* Avatar */}
                <View className="items-center mb-6">
                    <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center">
                        <Text className="text-3xl font-bold text-green-700">
                            {user.username?.[0]?.toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <Text className="text-xl font-bold text-gray-900 mt-3">{user.username}</Text>
                    <View className="bg-green-50 px-3 py-1 rounded-full mt-1">
                        <Text className="text-green-700 text-xs font-semibold capitalize">{user.role}</Text>
                    </View>
                </View>

                {/* Profile Info */}
                <View className="bg-slate-50 rounded-2xl p-4 mb-4">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="font-semibold text-gray-800">Personal Info</Text>
                        <TouchableOpacity onPress={() => {
                            if (editMode) { setUsername(user.username); setPhone(user.phone || '') }
                            setEditMode(!editMode)
                        }}>
                            <Text className="text-green-600 text-sm font-medium">{editMode ? 'Cancel' : 'Edit'}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Name */}
                    <View className="flex-row items-center space-x-3 mb-3">
                        <User size={18} color="#94a3b8" />
                        {editMode ? (
                            <TextInput
                                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm"
                                value={username}
                                onChangeText={setUsername}
                                placeholder="Full name"
                            />
                        ) : (
                            <Text className="text-gray-700">{user.username}</Text>
                        )}
                    </View>

                    {/* Phone */}
                    <View className="flex-row items-center space-x-3 mb-3">
                        <Phone size={18} color="#94a3b8" />
                        {editMode ? (
                            <TextInput
                                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm"
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Phone number"
                                keyboardType="phone-pad"
                            />
                        ) : (
                            <Text className="text-gray-700">{user.phone || '—'}</Text>
                        )}
                    </View>

                    {/* Email */}
                    <View className="flex-row items-center space-x-3">
                        <Mail size={18} color="#94a3b8" />
                        <Text className="text-gray-700">{user.email}</Text>
                    </View>

                    {editMode && (
                        <TouchableOpacity
                            onPress={handleSave}
                            disabled={saving}
                            className="bg-green-500 py-3 rounded-xl mt-4 items-center"
                        >
                            {saving ? <ActivityIndicator color="white" size="small" /> : <Text className="text-white font-semibold">Save Changes</Text>}
                        </TouchableOpacity>
                    )}
                </View>

                {/* Change Password */}
                <TouchableOpacity
                    onPress={() => setShowPwForm(!showPwForm)}
                    className="bg-slate-50 rounded-2xl p-4 mb-4 flex-row items-center justify-between"
                >
                    <View className="flex-row items-center space-x-3">
                        <Lock size={18} color="#94a3b8" />
                        <Text className="text-gray-700 font-medium">Change Password</Text>
                    </View>
                    <ChevronRight size={18} color="#94a3b8" />
                </TouchableOpacity>

                {showPwForm && (
                    <View className="bg-slate-50 rounded-2xl p-4 mb-4">
                        <TextInput
                            className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm"
                            placeholder="Current password"
                            secureTextEntry
                            value={currentPw}
                            onChangeText={setCurrentPw}
                        />
                        <TextInput
                            className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm"
                            placeholder="New password (min 6 chars)"
                            secureTextEntry
                            value={newPw}
                            onChangeText={setNewPw}
                        />
                        <TouchableOpacity
                            onPress={handlePasswordChange}
                            disabled={pwLoading}
                            className="bg-green-500 py-3 rounded-xl items-center"
                        >
                            {pwLoading ? <ActivityIndicator color="white" size="small" /> : <Text className="text-white font-semibold">Update Password</Text>}
                        </TouchableOpacity>
                    </View>
                )}

                {/* Logout */}
                <TouchableOpacity
                    onPress={handleLogout}
                    className="bg-red-50 rounded-2xl p-4 mb-8 flex-row items-center space-x-3"
                >
                    <LogOut size={18} color="#ef4444" />
                    <Text className="text-red-500 font-semibold">Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ProfileScreen
