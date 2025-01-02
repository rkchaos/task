import React, { useEffect } from 'react';
// import { Redirect } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    useEffect(() => {
        
        const token = localStorage.getItem('token'); 
        if (!token) {
           
            window.location.href = "/login"; 
        }
    }, []);

    return children;
};

export default ProtectedRoute;
