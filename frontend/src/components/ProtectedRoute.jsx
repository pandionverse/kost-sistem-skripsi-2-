import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(userStr);
        if (allowedRoles && !allowedRoles.includes(user.role)) {
            // Role not authorized, redirect to their dashboard or home
            return <Navigate to="/" replace />;
        }
        return <Outlet />;
    } catch (e) {
        localStorage.clear();
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;
