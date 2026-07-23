import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// In dev: reads from app.json extra.apiUrl
// In EAS build: reads from eas.json env.API_URL (injected at build time)
const API_URL =
    process.env.API_URL ||
    Constants.expoConfig?.extra?.apiUrl ||
    'http://192.168.2.102:5000/api/v1';

export const BASE_URL    = API_URL;
export const UPLOADS_URL = API_URL.replace('/api/v1', '') + '/uploads';

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
