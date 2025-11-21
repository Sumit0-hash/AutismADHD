import React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IUser, ICourse, IEvent, IResource } from '../types/index.js';

interface UserContextType {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  courses: ICourse[];
  setCourses: (courses: ICourse[]) => void;
  events: IEvent[];
  setEvents: (events: IEvent[]) => void;
  resources: IResource[];
  setResources: (resources: IResource[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [resources, setResources] = useState<IResource[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
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
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
