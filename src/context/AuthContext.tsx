
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface User {
  uid: string;
  email: string | null;
  name?: string;
  address?: string;
}

export interface Appointment {
  id: number;
  user: string;
  item: string;
  type: 'Doctor' | 'Lab Test';
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed';
}

interface UserDetails {
    name: string;
    address: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  appointments: Appointment[];
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, details: UserDetails) => Promise<void>;
  logout: () => void;
  addAppointment: (appointmentData: Omit<Appointment, 'id' | 'user' | 'status'>) => void;
  updateUserDetails: (details: UserDetails) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database for storing registered users and their details
const userStore: { [key: string]: User } = {
    'user-123': {
        uid: 'user-123',
        email: 'user@healthconnect.com',
        name: 'Demo User',
        address: '123 Health St, Wellness City'
    }
};
const passwordStore: { [key: string]: string } = {
    'user-123': 'password'
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check if a user is saved in local storage to persist login
    const savedUser = localStorage.getItem('healthConnectUser');
    if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        loadAppointments(parsedUser.uid);
    }
    setLoading(false);
  }, []);

  const loadAppointments = (userId: string) => {
    const storedAppointments = localStorage.getItem(`healthConnectAppointments_${userId}`);
    if (storedAppointments) {
      setAppointments(JSON.parse(storedAppointments));
    }
  }

  const saveAppointments = (userId: string, newAppointments: Appointment[]) => {
      localStorage.setItem(`healthConnectAppointments_${userId}`, JSON.stringify(newAppointments));
  }

  const login = async (email: string, password: string) => {
    const userEntry = Object.values(userStore).find(u => u.email === email);
    
    if (userEntry && passwordStore[userEntry.uid] === password) {
        setUser(userEntry);
        localStorage.setItem('healthConnectUser', JSON.stringify(userEntry));
        loadAppointments(userEntry.uid);
        toast({ title: 'Login Successful' });
        router.push('/profile');
    } else {
        throw new Error('Invalid email or password.');
    }
  }

  const signup = async (email: string, password: string, details: UserDetails) => {
      if (Object.values(userStore).some(u => u.email === email)) {
          throw new Error('An account with this email already exists.');
      }

      const newUid = `user-${Date.now()}`;
      const newUser: User = {
          uid: newUid,
          email,
          ...details,
      };

      userStore[newUid] = newUser;
      passwordStore[newUid] = password;

      setUser(newUser);
      localStorage.setItem('healthConnectUser', JSON.stringify(newUser));
      toast({ title: 'Account created successfully!' });
      router.push('/profile');
  }

  const updateUserDetails = (details: UserDetails) => {
      if(user) {
          const updatedUser = { ...user, ...details };
          userStore[user.uid] = updatedUser;
          setUser(updatedUser);
          localStorage.setItem('healthConnectUser', JSON.stringify(updatedUser));
          toast({ title: 'Profile updated!'});
          router.push('/profile');
      }
  }

  const logout = async () => {
    setUser(null);
    setAppointments([]);
    localStorage.removeItem('healthConnectUser');
    toast({ title: "You have been logged out successfully." });
    router.push('/login');
  };

  const addAppointment = (appointmentData: Omit<Appointment, 'id' | 'user' | 'status'>) => {
      if(!user) return;
      const newAppointment: Appointment = {
          ...appointmentData,
          id: appointments.length + 1,
          user: user.name || user.email || 'Unknown',
          status: 'Pending',
      }
      const newAppointments = [...appointments, newAppointment];
      setAppointments(newAppointments);
      saveAppointments(user.uid, newAppointments);
  }

  return (
    <AuthContext.Provider value={{ user, loading, appointments, login, signup, logout, addAppointment, updateUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
