import React from 'react';
import { createContext, useContext, useState, ReactNode } from 'react';
// Note: This file has been refactored to remove all user authentication state (user, setUser)
// and now handles only application data (courses, events, resources).
import { ICourse, IEvent, IResource } from '../types/index.js'; // Removed IUser import

// Interface now only tracks application data and loading state
interface DataContextType {
  courses: ICourse[];
  setCourses: (courses: ICourse[]) => void;
  events: IEvent[];
  setEvents: (events: IEvent[]) => void;
  resources: IResource[];
  setResources: (resources: IResource[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// Renamed context internally to DataContext
const DataContext = createContext<DataContextType | undefined>(undefined);

// Renamed provider internally to DataProvider
export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Removed user and setUser state
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [resources, setResources] = useState<IResource[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <DataContext.Provider
      value={{
        courses,
        setCourses,
        events,
        setEvents,
        resources,
        setResources,
        loading,
        setLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Renamed hook to useData
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    // Updated error message to reflect the new name
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};