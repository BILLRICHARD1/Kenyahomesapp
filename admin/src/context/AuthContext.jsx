// import { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [token, setToken] = useState(null);

//     // Create axios instance
//     const api = axios.create({
//         baseURL: 'http://localhost:5000/api/v1',
//     });

//     // Interceptor to attach token
//     api.interceptors.request.use((config) => {
//         const currentToken = token || localStorage.getItem('token');
//         if (currentToken) {
//             config.headers.Authorization = `Bearer ${currentToken}`;
//         }
//         return config;
//     });

//     const fetchProfile = async (authToken = null) => {
//         const tokenToUse = authToken || token || localStorage.getItem('token');

//         if (!tokenToUse) {
//             console.warn("No token available for profile fetch");
//             return null;
//         }

//         try {
//             const response = await api.get('/users/profile');
//             console.log("✅ Profile fetched:", response.data);
//             setUser(response.data);
//             return response.data;
//         } catch (error) {
//             console.error("❌ Profile fetch failed:", error.response?.data || error.message);

//             if (error.response?.status === 401) {
//                 logout();
//             }
//             return null;
//         }
//     };

//     // Load token & profile on startup
//     useEffect(() => {
//         const savedToken = localStorage.getItem('token');
//         if (savedToken) {
//             setToken(savedToken);
//             fetchProfile(savedToken);
//         }
//         setIsLoading(false);
//     }, []);

//     const login = async (email, password) => {
//         try {
//             const response = await api.post('/users/login', { email, password });

//             const { token: newToken } = response.data;

//             // Save token
//             setToken(newToken);
//             localStorage.setItem('token', newToken);

//             // Fetch profile immediately after login
//             await fetchProfile(newToken);

//             return { success: true, data: response.data };

//         } catch (error) {
//             const errorMessage = error.response?.data?.message || "Login failed";
//             throw new Error(errorMessage);
//         }
//     };

//     const logout = () => {
//         setUser(null);
//         setToken(null);
//         localStorage.removeItem('token');
//     };

//     const value = {
//         user,
//         isLoading,
//         isAuthenticated: !!user,
//         login,
//         logout,
//         fetchProfile,
//     };

//     return (
//         <AuthContext.Provider value={value}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (context === null) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// };


import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);   // Keep this true initially
    const [isMaintenance, setIsMaintenance] = useState(false)
    const [maintenancemessage, setMaintenancemessage] = useState(null)

    const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
    });

    api.interceptors.request.use((config) => {
        const currentToken = token || localStorage.getItem('token');
        if (currentToken) config.headers.Authorization = `Bearer ${currentToken}`;
        return config;
    });

    const fetchProfile = async (authToken) => {
        if (!authToken) return null;
        try {
            const res = await api.get('/users/profile');
            setUser(res.data);
            return res.data;
        } catch (err) {
            console.error("Profile fetch failed:", err.response?.data);
            if (err.response?.status === 401) logout();
            return null;
        }
    };

    // Single effect: load token + profile + settings before rendering
    useEffect(() => {
        const initAuth = async () => {
            // 1. Restore session from localStorage
            const savedToken = localStorage.getItem('token');
            if (savedToken) {
                setToken(savedToken);
                await fetchProfile(savedToken);
            }

            // 2. Check maintenance mode
            try {
                const response = await api.get('/admin/getsettings');
                const data = response.data;
                if (data.settings?.[0]?.isMaintenance) {
                    setIsMaintenance(true);
                    setMaintenancemessage(data.settings[0].maintenanceMessage);
                }
            } catch (error) {
                console.log('Could not fetch settings:', error.message);
            }

            // 3. Only mark loading done after both are resolved
            setIsLoading(false);
        };

        initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/users/login', { email, password });
            const { token: newToken } = response.data;

            setToken(newToken);
            localStorage.setItem('token', newToken);
            await fetchProfile(newToken);

            return { success: true };
        } catch (error) {
            throw new Error(error.response?.data?.message || "Login failed");
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    const value = {
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        isMaintenance,
        maintenancemessage
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};