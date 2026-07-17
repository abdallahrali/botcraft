import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import NotFound from './pages/NotFound';

// Components
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#2d2d2d',
            color: '#fff',
            fontFamily: '"VT323", monospace',
            fontSize: '18px',
            border: '2px solid #555',
            boxShadow: 'inset -2px -2px 0 #1a1a1a, inset 2px 2px 0 #4d4d4d',
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Navigate to="/signup" replace />} />

        {/* Protected Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
