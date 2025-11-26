// Below is the code content of client/src/App.tsx as requested:
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth, SignIn, SignUp, useUser } from '@clerk/clerk-react'; 
import { DataProvider } from './context/UserContext.js'; 

import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Productivity } from './pages/Productivity';
import { Courses } from './pages/Courses';
import { Resources } from './pages/Resources';
import { Events } from './pages/Events';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';

// --- NEW PROTECTED ROUTE COMPONENT (Uses Clerk) ---
const ProtectedRoute = () => {
    const { isLoaded, isSignedIn } = useAuth();
    
    if (!isLoaded) {
        return <div className="p-4 text-center">Loading...</div>;
    }

    if (isSignedIn) {
        return <Outlet />;
    }

    return <Navigate to="/sign-in" replace />;
};

const App: React.FC = () => {
    const { user: clerkUser, isLoaded: isUserLoaded } = useUser(); 
    
    const isAdmin = isUserLoaded && clerkUser?.publicMetadata?.userType === 'admin'; 
    
    return (
        <Router>
            {/* THIS IS THE CRITICAL FIX */}
            <DataProvider>
                <div className="flex flex-col min-h-screen">
                    <Header isAdmin={isAdmin} /> 
                    
                    <main className="flex-1">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/courses" element={<Courses />} />
                            <Route path="/resources" element={<Resources />} />
                            <Route path="/events" element={<Events />} />
                            
                            <Route 
                                path="/sign-in/*" 
                                element={<SignIn routing="path" path="/sign-in" />} 
                            />
                            <Route 
                                path="/sign-up/*" 
                                element={<SignUp routing="path" path="/sign-up" />} 
                            />

                            <Route element={<ProtectedRoute />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/productivity" element={<Productivity />} />
                                <Route path="/profile" element={<Profile />} />
                                
                                {isAdmin && <Route path="/admin" element={<Admin />} />}
                            </Route>

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                </div>
            </DataProvider>
        </Router>
    );
};

export default App;