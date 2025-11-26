import React from 'react';
import { useState, useEffect } from 'react';
// IMPORT FIX 1: Use Clerk's useUser for authenticated user data
import { useUser } from '@clerk/clerk-react';
// IMPORT FIX 2: Use the new application data hook (assuming the file is now DataContext.js)
import { useData } from '../context/UserContext.js'; // Assuming this file now exports useData
import { BookOpen, Calendar, User, CheckCircle } from 'lucide-react';
import type { ICourse } from '../types/index.js';

export const Courses = () => {
  // Use Clerk's user for identity and enrollment status checking
  const { user, isLoaded: isUserLoaded } = useUser();
  
  // Use the refactored context hook for managing course data globally
  const { courses, setCourses } = useData(); 
  
  // We cannot use setUser directly on Clerk's user object. 
  // Any change to enrolledCourses must trigger an API call to update Clerk's publicMetadata 
  // and your backend (MongoDB) in a real application. 
  // For now, we will use a console log to simulate the API call.

  const [filter, setFilter] = useState<'all' | 'enrolled' | 'available'>('all');
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);

  useEffect(() => {
    // NOTE: This mock course data fetch will be replaced by your MongoDB API call in Week 5
    const mockCourses: ICourse[] = [
      {
        _id: 'course_1',
        courseTitle: 'Understanding ADHD: The Basics',
        courseDescription: 'An introductory course covering ADHD fundamentals, symptoms, and management strategies.',
        courseInstructor: 'Dr. Sarah Williams',
        courseStartDate: new Date('2024-12-01'),
        courseEndDate: new Date('2025-01-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'course_2',
        courseTitle: 'Time Management for ADHD',
        courseDescription: 'Learn practical time management techniques specifically designed for ADHD minds.',
        courseInstructor: 'James Thompson',
        courseStartDate: new Date('2024-12-10'),
        courseEndDate: new Date('2025-01-20'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'course_3',
        courseTitle: 'Building Productive Routines',
        courseDescription: 'Develop sustainable routines that work with, not against, your ADHD brain.',
        courseInstructor: 'Emma Rodriguez',
        courseStartDate: new Date('2024-12-15'),
        courseEndDate: new Date('2025-02-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    setCourses(mockCourses);
  }, [setCourses]);
  
  // Safely get enrolled courses from Clerk user's public metadata, defaulting to an empty array.
  const enrolledCourses: string[] = isUserLoaded 
    ? (user?.publicMetadata?.enrolledCourses as string[] || [])
    : [];

  const filteredCourses = courses.filter(course => {
    if (filter === 'enrolled') {
      return enrolledCourses.includes(course._id!);
    }
    if (filter === 'available') {
      return !enrolledCourses.includes(course._id!);
    }
    return true;
  });

  const handleEnroll = (courseId: string) => {
    if (!user) return;
    
    // Simulate updating the user's enrolledCourses list
    if (!enrolledCourses.includes(courseId)) {
      const newEnrolledCourses = [...enrolledCourses, courseId];
      
      console.log(`SIMULATING API CALL: Updating Clerk public metadata and MongoDB with new enrolled courses: ${newEnrolledCourses}`);
      
      // In a real application, you would call your backend API here:
      // api.updateUserMetadata(user.id, { enrolledCourses: newEnrolledCourses });
    }
  };

  if (!isUserLoaded) {
      return (
          <div className="flex justify-center items-center min-h-screen">
              <p className="text-[#30506C]">Loading authentication status...</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#D7E9ED]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-[#30506C] mb-2">Courses</h1>
        <p className="text-[#263A47] mb-8">Develop new skills and strategies tailored for ADHD</p>

        <div className="flex space-x-2 mb-6">
          {(['all', 'enrolled', 'available'] as const).map(filterOption => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === filterOption
                  ? 'bg-[#469CA4] text-white'
                  : 'bg-white text-[#263A47] hover:bg-[#D7E9ED]'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {filteredCourses.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-[#263A47] mb-4">No courses found</p>
                {filter !== 'all' && (
                  <button
                    onClick={() => setFilter('all')}
                    className="text-[#469CA4] hover:underline font-medium"
                  >
                    View all courses
                  </button>
                )}
              </div>
            ) : (
              filteredCourses.map(course => {
                const isEnrolled = enrolledCourses.includes(course._id!);
                return (
                  <div
                    key={course._id}
                    onClick={() => setSelectedCourse(course)}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                  >
                    <div className="bg-gradient-to-r from-[#30506C] to-[#469CA4] h-32"></div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-[#30506C]">{course.courseTitle}</h3>
                        {isEnrolled && (
                          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center space-x-1">
                            <CheckCircle size={16} />
                            <span className="text-sm font-medium">Enrolled</span>
                          </div>
                        )}
                      </div>
                      <p className="text-[#263A47] mb-4">{course.courseDescription}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-[#263A47] text-sm">
                          <User size={16} />
                          <span>{course.courseInstructor}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[#263A47] text-sm">
                          <Calendar size={16} />
                          <span>
                            {new Date(course.courseStartDate).toLocaleDateString()} -{' '}
                            {new Date(course.courseEndDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEnroll(course._id!);
                        }}
                        disabled={isEnrolled}
                        className={`w-full py-2 rounded-lg font-medium transition ${
                          isEnrolled
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-[#469CA4] hover:bg-[#3a7f8a] text-white'
                        }`}
                      >
                        {isEnrolled ? 'Enrolled' : 'Enroll Now'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {selectedCourse && (
            <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-6">
              <h2 className="text-xl font-bold text-[#30506C] mb-4">Course Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-[#263A47] mb-1">Title</p>
                  <p className="text-[#30506C]">{selectedCourse.courseTitle}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#263A47] mb-1">Instructor</p>
                  <p className="text-[#30506C]">{selectedCourse.courseInstructor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#263A47] mb-1">Duration</p>
                  <p className="text-[#30506C]">
                    {Math.ceil(
                      (new Date(selectedCourse.courseEndDate).getTime() -
                        new Date(selectedCourse.courseStartDate).getTime()) /
                        (1000 * 60 * 60 * 24 * 7)
                    )}{' '}
                    weeks
                  </p>
                </div>
                <button
                  onClick={() => {
                    handleEnroll(selectedCourse._id!);
                    setSelectedCourse(null);
                  }}
                  disabled={enrolledCourses.includes(selectedCourse._id!)}
                  className={`w-full py-2 rounded-lg font-medium transition ${
                    enrolledCourses.includes(selectedCourse._id!)
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-[#469CA4] hover:bg-[#3a7f8a] text-white'
                  }`}
                >
                  {enrolledCourses.includes(selectedCourse._id!) ? 'Enrolled' : 'Enroll Now'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};