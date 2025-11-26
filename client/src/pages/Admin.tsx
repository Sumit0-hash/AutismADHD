import React from 'react';
// FIX 1: Import Clerk's useUser for authenticated user identity and metadata
import { useUser } from '@clerk/clerk-react'; 
// FIX 2: Import the new application data hook (useData)
import { useData } from '../context/UserContext.js'; // Assuming this file now exports useData
import { BarChart3, Users, BookOpen, Calendar, Settings } from 'lucide-react';

export const Admin = () => {
  // 1. Authentication Data (from Clerk)
  const { user, isLoaded: isUserLoaded } = useUser();
  
  // 2. Application Data (from our refactored Data Context)
  const { courses, events, resources, loading: isDataLoading } = useData();
  
  // Combine loading states
  if (!isUserLoaded || isDataLoading) {
    return (
      <div className="min-h-screen bg-[#EFE3DF] flex items-center justify-center">
        <p className="text-[#30506C]">Loading Admin authentication...</p>
      </div>
    );
  }

  // --- ACCESS DENIAL CHECK ---
  // Safely check the user type from Clerk's public metadata
  const userType = user?.publicMetadata?.userType;
  if (userType !== 'admin') {
    return (
      <div className="min-h-screen bg-[#EFE3DF] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <Settings size={48} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-[#30506C] mb-2">Access Denied</h1>
          <p className="text-[#263A47]">You do not have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Courses', value: courses.length, icon: <BookOpen /> },
    { label: 'Total Events', value: events.length, icon: <Calendar /> },
    { label: 'Total Resources', value: resources.length, icon: <Users /> },
  ];

  return (
    <div className="min-h-screen bg-[#EFE3DF]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-[#30506C] mb-2">Admin Dashboard</h1>
        <p className="text-[#263A47] mb-8">Manage courses, events, and resources</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#469CA4]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#263A47] text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#30506C] mt-2">{stat.value}</p>
                </div>
                <div className="text-3xl text-[#469CA4] opacity-20">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#30506C] mb-4 flex items-center space-x-2">
              <BookOpen size={24} />
              <span>Courses</span>
            </h2>
            <div className="space-y-3">
              {courses.length === 0 ? (
                <p className="text-[#263A47]">No courses yet</p>
              ) : (
                courses.map(course => (
                  <div key={course._id} className="p-3 bg-[#F5F0ED] rounded-lg">
                    <p className="font-semibold text-[#30506C]">{course.courseTitle}</p>
                    <p className="text-xs text-[#263A47]">{course.courseInstructor}</p>
                  </div>
                ))
              )}
            </div>
            <button className="w-full mt-4 bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition">
              Add Course
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#30506C] mb-4 flex items-center space-x-2">
              <Calendar size={24} />
              <span>Events</span>
            </h2>
            <div className="space-y-3">
              {events.length === 0 ? (
                <p className="text-[#263A47]">No events yet</p>
              ) : (
                events.map(event => (
                  <div key={event._id} className="p-3 bg-[#F5F0ED] rounded-lg">
                    <p className="font-semibold text-[#30506C]">{event.eventName}</p>
                    <p className="text-xs text-[#263A47]">
                      {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
            <button className="w-full mt-4 bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition">
              Add Event
            </button>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-[#30506C] mb-4 flex items-center space-x-2">
            <Users size={24} />
            <span>Resources</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {resources.length === 0 ? (
              <p className="text-[#263A47]">No resources yet</p>
            ) : (
              resources.map(resource => (
                <div key={resource._id} className="p-3 bg-[#F5F0ED] rounded-lg">
                  <p className="font-semibold text-[#30506C]">{resource.resourceTitle}</p>
                  <p className="text-xs text-[#263A47]">{resource.resourceCategory}</p>
                </div>
              ))
            )}
          </div>
          <button className="w-full mt-4 bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition">
            Add Resource
          </button>
        </div>
      </div>
    </div>
  );
};