import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
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

const RegisterScreen = () => {
    const [username, setUsername] = useState('Jimmin');
    const [phone, setPhone] = useState('0112163919');
    const [email, setEmail] = useState('jameswafula2002@gmail.com');
    const [password, setPassword] = useState('12345678');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const { register } = useUser();

    const handleRegister = async () => {
        if (!username.trim() || !phone.trim() || !email.trim() || !password.trim()) {
            return Alert.alert('Error', 'All fields are required');
        }
        if (password.length < 6) {
            return Alert.alert('Error', 'Password must be at least 6 characters');
        }
        setLoading(true);
        try {
            await register(username.trim(), phone.trim(), email.trim(), password);
            navigation.replace('Main');
        } catch (err) {
            const msg = err?.response?.data?.message || 'Registration failed. Please try again.';
            Alert.alert('Sign Up Failed', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white p-5">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <Text className="text-3xl font-bold text-gray-900 mb-1 mt-8">Create Account</Text>
                    <Text className="text-gray-500 mb-10">Join Kenya Homes to find your perfect place.</Text>

                    <AuthInput label="Full Name" placeholder="Enter your name" value={username} onChangeText={setUsername} />
                    <AuthInput label="Phone Number" placeholder="e.g. 0712345678" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                    <AuthInput label="Email" placeholder="Enter your email" value={email} onChangeText={setEmail} keyboardType="email-address" />
                    <AuthInput label="Password" placeholder="At least 6 characters" value={password} onChangeText={setPassword} secureTextEntry />

                    <TouchableOpacity
                        className="bg-[#16a34a] py-4 rounded-2xl mb-6 active:opacity-90 items-center"
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading
                            ? <ActivityIndicator color="white" />
                            : <Text className="text-white text-center font-semibold text-lg">Sign up</Text>
                        }
                    </TouchableOpacity>

                    <View className="flex-row justify-center mt-4">
                        <Text className="text-gray-500">Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text className="font-semibold text-[#16a34a]">Sign in</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default RegisterScreen;
