// import { createContext, useContext, useEffect } from "react";
// import { useAuth } from "./AuthContext";
// import axios from "axios";

// const ApiContext = createContext();

// export const ApiProvider = ({ children }) => {
//     const { isLoading, token, user } = useAuth();

//     const api = axios.create({
//         baseURL: 'http://localhost:5000/api/v1',
//     });

//     api.interceptors.request.use((config) => {
//         const currentToken = token || localStorage.getItem('token');
//         if (currentToken) config.headers.Authorization = `Bearer ${currentToken}`;
//         return config;
//     });

//     const getAllUsers = async () => {
//         // requires authorization bearer in with token to call request
//         try {
//             const response = await api.get('/admin/allusers');
//             console.log("response", response);
//             return response.data;
//         } catch (error) {
//             throw new Error(error.response?.data?.message || "Failed to fetch users");
//         }
//     }
//     console.log("user role",user.role)
//     // create promise for all functions
//     useEffect(() => {
//         // create promise for all functions
//         const promises = [
//             user?.role === 'admin' ? getAllUsers() : Promise.resolve()
//         ];
//         Promise.all(promises).then((res) => {
//             console.log("res", res);
//         }).catch((err) => {
//             console.log("err", err);
//         });
//     }, [])

//     return (
//         <ApiContext.Provider value={children}>
//             {children}
//         </ApiContext.Provider>
//     );
// };

// export const useApi = () => {
//     const context = useContext(ApiContext);
//     if (!context) throw new Error('useApi must be used within ApiProvider');
//     return context;
// };

import { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
    const { token, user } = useAuth();

    const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
    });

    api.interceptors.request.use((config) => {
        const currentToken = token || localStorage.getItem('token');
        if (currentToken) {
            config.headers.Authorization = `Bearer ${currentToken}`;
        }
        return config;
    });

    // ==================== API Functions ====================

    const getAllUsers = async () => {
        if (user?.role !== 'admin') {
            throw new Error("Access denied. Only admin can view all users.");
        }
        const res = await api.get('/admin/allusers');
        console.log("response while getting users", res.data.users)
        return res.data;
    };

    const getAllListings = async () => {
        if (user?.role !== 'admin') {
            throw new Error("Access denied. Only admin can view all users.");
        }
        const res = await api.get('/admin/listings');
        return res.data;
    };

    const getStats = async () => {
        if (user?.role !== 'admin') {
            throw new Error("Access denied. Only admin can view all users.");
        }
        const res = await api.get('/admin/stats');
        // console.log("ststs returned", res.data)
        return res.data;
    };

    const getProfile = async () => {
        const res = await api.get('/users/profile');
        return res.data;
    };


    const addNewUser = async (username, email, password, role, phone = '') => {
        const response = await api.post('/users/register', { username, email, password, role, phone });

        return { success: true, data: response.data };
    }


    const resetPassword = async (currentpassword, newpassword, userid) => {
        try {
            const response = await api.post(`/users/passreset/${userid}`, { currentpassword, newpassword });
            return { success: true, data: response.data };
        } catch (error) {
            console.log("error", error)
            return { success: false, error: error.response.data };
        }
    }

    // create request for materials
    const requestMaterials = async (requestedby, items, description) => {
        const response = await api.post('/users/requestmaterial', { requestedby, items, description });

        if (response.data) {
            return { success: true, data: response.data };
        }
        return { success: true, error: response.data };
    }

    const updateUser = async (username, email, password, role, id) => {
        const response = await api.put(`/admin/updateaccount/${id}`, { username, email, password, role });

        return { success: true, data: response.data };
    }

    const deleteUser = async (id) => {
        const response = await api.delete(`/admin/deleteaccount/${id}`);

        return { success: true, data: response.data };
    }



    const getInventory = async () => await api.get('/apartments').then(r => r.data);

    // Add more functions as needed...

    const value = useMemo(() => ({
        api,
        getProfile,
        getInventory,
        getAllUsers,
        addNewUser,
        updateUser,
        deleteUser,
        requestMaterials,
        resetPassword,
        getAllListings,
        getStats
    }), [token, user?.role]);

    return (
        <ApiContext.Provider value={value}>
            {children}
        </ApiContext.Provider>
    );
};

export const useApi = () => {
    const context = useContext(ApiContext);
    if (!context) throw new Error('useApi must be used within ApiProvider');
    return context;
};