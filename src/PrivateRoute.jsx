import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, ...rest }) => {
    const isAuthenticated = sessionStorage.getItem('userProfile'); // Check if userProfile is stored

    return (
        <Route
            {...rest}
            element={isAuthenticated ? element : <Navigate to="/login-techright" />}
        />
    );
};

export default PrivateRoute;
