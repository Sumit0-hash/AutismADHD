import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import type { IUser } from '../types';

export const Login = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = () => {
    // Mock User Data
    const mockUser: IUser = {
        clerkId: 'user_demo_123',
        userFirstName: 'Alex',
        userLastName: 'Johnson',
        userEmail: 'alex.johnson@example.com',
        userType: 'user',
        emotionalCheckins: [],
        plannerEntries: [],
        enrolledCourses: ['course_1'],
        favoriteResources: ['resource_2', 'resource_3'],
        registeredEvents: ['event_1'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

    setUser(mockUser);
    localStorage.setItem('adhd_user', JSON.stringify(mockUser));
    navigate('/dashboard'); // Redirect to dashboard after login
  };

  return (
    <div className="min-h-screen bg-[#D7E9ED] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-[#469CA4] rounded-lg flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-3xl">A</span>
        </div>
        <h1 className="text-3xl font-bold text-[#30506C] mb-2">ADHD Support UK</h1>
        <p className="text-[#263A47] mb-6">
          A comprehensive platform designed to help you manage ADHD with productivity tools, resources, and community support.
        </p>
        <button
          onClick={handleLogin}
          className="w-full bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-bold py-3 rounded-lg transition"
        >
          Login as Demo User
        </button>
      </div>
    </div>
  );
};