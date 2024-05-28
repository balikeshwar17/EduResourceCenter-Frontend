import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ Component }) => {
    const isAuthenticated = useSelector((state) => state.isAuthenticated);
    
    console.log(isAuthenticated);

    return isAuthenticated ? (
        <>
            <Component />
        </>
    ) : (
        <Navigate to="/login" />
    );
};

export default ProtectedRoute;
