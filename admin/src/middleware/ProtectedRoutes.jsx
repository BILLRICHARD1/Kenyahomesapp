import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingPage from '../pages/LoadingPage';
import MaintenancePage from '../pages/MaintenancePage';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading, isMaintenance, maintenancemessage } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <LoadingPage />;
    }

    if (isMaintenance) {
        return <MaintenancePage maintenancemessage={maintenancemessage} />;
    }


    if (!isAuthenticated) {
        // Redirect to login and save the attempted location
        return <Navigate
            to="/login"
            state={{ from: location }}
            replace
        />;
    }

    return children;
};

export default ProtectedRoute;