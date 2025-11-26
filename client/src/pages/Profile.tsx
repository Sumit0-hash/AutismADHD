import React from 'react';
// FIX 1: Import the new data hook (useData) for application state
import { useData } from '../context/UserContext.js'; // Assuming this file now exports useData
// FIX 2: Import the Clerk hook for authentication
import { useUser } from '@clerk/clerk-react';
import { Mail, User, BookOpen, Calendar, Heart, Lock, Settings } from 'lucide-react';
// NEW: Import necessary interfaces to structure the custom data
import type { IPlannerEntry, IEmotionalCheckin } from '../types/index.js';

// Define a type for the custom data structure stored in Clerk's publicMetadata
interface CustomUserData {
    emotionalCheckins: IEmotionalCheckin[];
    plannerEntries: IPlannerEntry[];
    enrolledCourses: string[];
    registeredEvents: string[];
    favoriteResources: string[];
    userType: 'user' | 'admin';
}


export const Profile = () => {
  // 1. Authentication Data (from Clerk)
  const { user, isLoaded: isUserLoaded } = useUser();
  
  // 2. Application Data (from our refactored Data Context)
  const { courses, events, resources, loading: isDataLoading } = useData();

  // --- LOADING CHECK ---
  if (!isUserLoaded || isDataLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-[#30506C]">Loading full profile data...</p>
      </div>
    );
  }

  // Safely extract the custom data arrays from Clerk's publicMetadata
  const customData = user?.publicMetadata as CustomUserData;

  // Safely define arrays from Clerk metadata, defaulting to empty arrays
  const enrolledCoursesIds = (customData?.enrolledCourses || []) as string[];
  const registeredEventsIds = (customData?.registeredEvents || []) as string[];
  const favoriteResourcesIds = (customData?.favoriteResources || []) as string[];

  // Safely define nested arrays from Clerk metadata, defaulting to empty arrays
  const emotionalCheckins = (customData?.emotionalCheckins || []) as IEmotionalCheckin[];
  const plannerEntries = (customData?.plannerEntries || []) as IPlannerEntry[];

  // 3. Combine Data Sources
  const enrolledCourseDetails = courses.filter(c => enrolledCoursesIds.includes(c._id!));
  const registeredEventDetails = events.filter(e => registeredEventsIds.includes(e._id!));
  const favoriteResourceDetails = resources.filter(r => favoriteResourcesIds.includes(r._id!));

  const primaryEmail = user?.emailAddresses[0]?.emailAddress || 'N/A';
  
  return (
    <div className="min-h-screen bg-[#D7E9ED]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#30506C] to-[#469CA4] h-32"></div>

          <div className="px-6 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
              <div className="w-20 h-20 -mt-16 bg-[#469CA4] rounded-full flex items-center justify-center text-white">
                {/* Display actual user image if available */}
                 <img 
                    src={user?.imageUrl || 'https://placehold.co/80x80/469CA4/FFFFFF?text=P'} 
                    alt={user?.firstName || "Profile"} 
                    className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[#30506C]">
                  {user?.fullName}
                </h1>
                <p className="text-[#263A47] flex items-center space-x-2 mt-1">
                  <Mail size={18} />
                  <span>{primaryEmail}</span>
                </p>
                {customData?.userType === 'admin' && (
                  <div className="mt-2 inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    Administrator
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-[#D7E9ED] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#263A47] text-sm">Total Check-ins</p>
                    <p className="text-2xl font-bold text-[#30506C]">{emotionalCheckins.length}</p>
                  </div>
                  <div className="text-[#469CA4] opacity-20">
                    <User size={32} />
                  </div>
                </div>
              </div>

              <div className="bg-[#D7E9ED] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#263A47] text-sm">Enrolled Courses</p>
                    <p className="text-2xl font-bold text-[#30506C]">
                      {enrolledCoursesIds.length}
                    </p>
                  </div>
                  <div className="text-[#469CA4] opacity-20">
                    <BookOpen size={32} />
                  </div>
                </div>
              </div>

              <div className="bg-[#D7E9ED] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#263A47] text-sm">Pending Tasks</p>
                    <p className="text-2xl font-bold text-[#30506C]">
                      {plannerEntries.filter(p => p.pEntryStatus === 'pending').length}
                    </p>
                  </div>
                  <div className="text-[#469CA4] opacity-20">
                    <Calendar size={32} />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#EFE3DF] pt-8 space-y-8">
              
              {/* Account Settings Link (Reusing structure from original Profile.tsx) */}
                <h2 className="text-xl font-bold text-[#30506C] mb-4">Account Settings</h2>
                <div className="space-y-3">
                    <a 
                        href={user?.id ? `/user/${user.id}/settings` : '#'} 
                        className="flex items-center justify-between p-3 bg-[#F5F0ED] rounded-lg hover:bg-[#D7E9ED] transition"
                    >
                        <div className="flex items-center space-x-3">
                            <Settings size={20} className="text-[#469CA4]" />
                            <span className="font-medium text-[#30506C]">Edit Profile Settings</span>
                        </div>
                        <Lock size={16} className="text-[#263A47]" />
                    </a>
                    <a 
                        href={user?.id ? `/user/${user.id}/security` : '#'} 
                        className="flex items-center justify-between p-3 bg-[#F5F0ED] rounded-lg hover:bg-[#D7E9ED] transition"
                    >
                        <div className="flex items-center space-x-3">
                            <Lock size={20} className="text-[#469CA4]" />
                            <span className="font-medium text-[#30506C]">Security and Authentication</span>
                        </div>
                        <Lock size={16} className="text-[#263A47]" />
                    </a>
                </div>


              <div>
                <h2 className="text-xl font-bold text-[#30506C] mb-4 flex items-center space-x-2">
                  <BookOpen size={24} />
                  <span>Enrolled Courses</span>
                </h2>
                {enrolledCourseDetails.length === 0 ? (
                  <p className="text-[#263A47]">No courses enrolled yet. Start learning!</p>
                ) : (
                  <div className="space-y-3">
                    {enrolledCourseDetails.map(course => (
                      <div key={course._id} className="bg-[#F5F0ED] rounded-lg p-4">
                        <h3 className="font-semibold text-[#30506C]">{course.courseTitle}</h3>
                        <p className="text-sm text-[#263A47]">Instructor: {course.courseInstructor}</p>
                        <p className="text-xs text-[#263A47] mt-1">
                          Ends: {new Date(course.courseEndDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#30506C] mb-4 flex items-center space-x-2">
                  <Calendar size={24} />
                  <span>Registered Events</span>
                </h2>
                {registeredEventDetails.length === 0 ? (
                  <p className="text-[#263A47]">No events registered. Check out upcoming events!</p>
                ) : (
                  <div className="space-y-3">
                    {registeredEventDetails.map(event => (
                      <div key={event._id} className="bg-[#F5F0ED] rounded-lg p-4">
                        <h3 className="font-semibold text-[#30506C]">{event.eventName}</h3>
                        <p className="text-sm text-[#263A47]">
                          {new Date(event.eventDate).toLocaleString()}
                        </p>
                        <p className="text-xs text-[#263A47]">{event.eventLocation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#30506C] mb-4 flex items-center space-x-2">
                  <Heart size={24} />
                  <span>Favorite Resources</span>
                </h2>
                {favoriteResourceDetails.length === 0 ? (
                  <p className="text-[#263A47]">No favorite resources yet. Explore resources!</p>
                ) : (
                  <div className="space-y-3">
                    {favoriteResourceDetails.map(resource => (
                      <div key={resource._id} className="bg-[#F5F0ED] rounded-lg p-4">
                        <h3 className="font-semibold text-[#30506C]">{resource.resourceTitle}</h3>
                        <p className="text-sm text-[#263A47]">{resource.resourceDescription}</p>
                        <a
                          href={resource.resourceLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#469CA4] hover:text-[#3a7f8a] text-xs font-medium mt-2 inline-block"
                        >
                          Open Resource →
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};