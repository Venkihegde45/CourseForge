import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCourse } from '../../lib/CourseContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useCourse();

    // Check if user has a valid JWT token
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
