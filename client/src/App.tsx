import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { UserProvider, useUser } from './context/UserContext';

import { Home } from './pages/Home'; 
import { Login } from './pages/Login'; 

import { Resources } from './pages/Resources';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';

import type { IUser } from './types/index';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useUser();
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }
  return children;
};

const AppContent = () => {
  const { user, setUser } = useUser();
  const [userEmail, setUserEmail] = useState('');

  // Load user from local storage on boot
  useEffect(() => {
    const storedUser = localStorage.getItem('adhd_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as IUser;
      setUser(parsedUser);
    }
  }, [setUser]);

  // Update local email state when user changes
  useEffect(() => {
    if (user) {
      setUserEmail(user.userEmail);
    } else {
      setUserEmail('');
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('adhd_user');
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      <Header 
        userEmail={userEmail} 
        onLogout={user ? handleLogout : undefined} 
        isAdmin={user?.userType === 'admin'} 
      />
      
      <main className="flex-1">
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<Login />} /> {/* Redirect sign-up to login for now */}

          {/* PROTECTED ROUTES (Require Login) */}
          <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Router>
  );
}

export default App;