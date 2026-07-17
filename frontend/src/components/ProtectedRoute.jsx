import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
import LoadingScreen from './LoadingScreen';

/**
 * ProtectedRoute — route guard that verifies session authentication.
 *
 * Since there is no dedicated /api/auth/me endpoint, we probe
 * GET /api/bots (a protected route) to determine session validity.
 *
 * States:
 *  - loading  → show LoadingScreen
 *  - authed   → render children
 *  - !authed  → redirect to /login
 */
const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'authenticated' | 'unauthenticated'
  const [user, setUser] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        // Hit a protected endpoint to verify session
        await api.get('/bots');

        if (!cancelled) {
          // The session is valid — we don't necessarily have user data
          // from /bots, but we can set authenticated status.
          setStatus('authenticated');
        }
      } catch (err) {
        if (!cancelled) {
          // 401 or network error → not authenticated
          setStatus('unauthenticated');
        }
      }
    };

    checkAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'loading') {
    return <LoadingScreen message="Checking session..." />;
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  // Authenticated — render children
  return <>{children}</>;
};

export default ProtectedRoute;
