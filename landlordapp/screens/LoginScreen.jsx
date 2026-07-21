import { Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';

const AuthInput = ({ label, placeholder, value, onChangeText, secureTextEntry = false, keyboardType = 'default' }) => (
    <View className="mb-5">
        <Text className="text-sm text-gray-600 mb-1.5 font-medium">{label}</Text>
        <TextInput
            className="bg-gray-100 rounded-2xl px-5 py-4 text-base border border-gray-200"
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize="none"
        />
    </View>
);

const LoginScreen = () => {
    const [email, setEmail] = useState('qode.current@gmail.com');
    const [password, setPassword] = useState('12345678');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const { login } = useUser();

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            return Alert.alert('Error', 'Please enter your email and password');
        }
        setLoading(true);
        try {
            await login(email.trim(), password);
            navigation.replace('Main');
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Login failed. Please try again.';
            Alert.alert('Login Failed', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white p-5">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <View className="w-16 h-16 bg-blue-100 rounded-2xl items-center justify-center mt-8 mb-6">
                        <Text className="text-3xl">🏠</Text>
                    </View>
                    <Text className="text-3xl font-bold text-gray-900 mb-1">Landlord Login</Text>
                    <Text className="text-gray-500 mb-10">Manage your property listings</Text>

                    <AuthInput label="Email" placeholder="Enter your email" value={email} onChangeText={setEmail} keyboardType="email-address" />
                    <AuthInput label="Password" placeholder="Enter your password" value={password} onChangeText={setPassword} secureTextEntry />

                    <TouchableOpacity
                        className="bg-blue-700 py-4 rounded-2xl mb-6 items-center"
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-center font-semibold text-lg">Sign in</Text>}
                    </TouchableOpacity>

                    <View className="flex-row justify-center mt-4">
                        <Text className="text-gray-500">New landlord? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text className="font-semibold text-blue-700">Create account</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginScreen;
