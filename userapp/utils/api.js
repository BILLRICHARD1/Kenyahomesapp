import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Change this to your machine's local IP when testing on a physical device
// For Expo Go on Android use your LAN IP; for iOS simulator use localhost
export const BASE_URL = 'http://localhost:5000/api/v1';
export const UPLOADS_URL = 'http://localhost:5000/uploads';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
});

// Attach token to every request
api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
