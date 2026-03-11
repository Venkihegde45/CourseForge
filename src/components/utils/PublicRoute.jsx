import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCourse } from '../../lib/CourseContext';

const PublicRoute = ({ children }) => {
    const { globalMemory } = useCourse();

    if (globalMemory && globalMemory.userName) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;
