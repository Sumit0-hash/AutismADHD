import React from 'react';
import { useUser } from '../context/UserContext.js';
import { User, Mail, BookOpen, Calendar, Heart } from 'lucide-react';

export const Profile = () => {
  const { user, courses, events, resources } = useUser();

  const enrolledCourseDetails = courses.filter(c => user?.enrolledCourses.includes(c._id!));
  const registeredEventDetails = events.filter(e => user?.registeredEvents.includes(e._id!));
  const favoriteResourceDetails = resources.filter(r => user?.favoriteResources.includes(r._id!));

  return (
    <div className="min-h-screen bg-[#D7E9ED]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#30506C] to-[#469CA4] h-32"></div>

          <div className="px-6 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
              <div className="w-20 h-20 -mt-16 bg-[#469CA4] rounded-full flex items-center justify-center text-white">
                <User size={40} />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[#30506C]">
                  {user?.userFirstName} {user?.userLastName}
                </h1>
                <p className="text-[#263A47] flex items-center space-x-2 mt-1">
                  <Mail size={18} />
                  <span>{user?.userEmail}</span>
                </p>
                {user?.userType === 'admin' && (
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
                    <p className="text-2xl font-bold text-[#30506C]">{user?.emotionalCheckins.length || 0}</p>
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
                      {user?.enrolledCourses.length || 0}
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
                      {user?.plannerEntries.filter(p => p.pEntryStatus === 'pending').length || 0}
                    </p>
                  </div>
                  <div className="text-[#469CA4] opacity-20">
                    <Calendar size={32} />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#EFE3DF] pt-8 space-y-8">
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
