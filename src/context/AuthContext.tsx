
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  email: string;
  address: string;
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

interface AuthContextType {
  user: User | null;
  appointments: Appointment[];
  login: (email: string, password: string) => void;
  logout: () => void;
  signup: (details: Omit<User, ''> & { password?: string }) => void;
  addAppointment: (appointmentData: Omit<Appointment, 'id' | 'user' | 'status'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const users: (User & {password: string})[] = [
    {
        name: "Test User",
        email: "user@test.com",
        password: "password",
        address: "123 Test St, Testville, USA"
    }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in from a previous session (e.g., localStorage)
    const storedUser = localStorage.getItem('healthConnectUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      loadAppointments(parsedUser.email);
    }
  }, []);

  const loadAppointments = (userEmail: string) => {
    const storedAppointments = localStorage.getItem(`healthConnectAppointments_${userEmail}`);
    if (storedAppointments) {
      setAppointments(JSON.parse(storedAppointments));
    }
  }

  const saveAppointments = (userEmail: string, newAppointments: Appointment[]) => {
      localStorage.setItem(`healthConnectAppointments_${userEmail}`, JSON.stringify(newAppointments));
  }

  const login = (email: string, password: string) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userToStore } = foundUser;
      setUser(userToStore);
      localStorage.setItem('healthConnectUser', JSON.stringify(userToStore));
      loadAppointments(userToStore.email);
    } else {
      throw new Error('Invalid email or password');
    }
  };

  const logout = () => {
    setUser(null);
    setAppointments([]);
    localStorage.removeItem('healthConnectUser');
    // We could also clear appointments for all users, but for this demo, we'll just clear the state.
    router.push('/login');
  };

  const signup = (details: Omit<User, ''> & { password?: string }) => {
    if(users.find(u => u.email === details.email)) {
        throw new Error('An account with this email already exists.');
    }
    const newUser = {
        name: details.name,
        email: details.email,
        password: details.password || "password",
        address: details.address
    }
    users.push(newUser);
    const { password, ...userToStore } = newUser;
    setUser(userToStore);
    localStorage.setItem('healthConnectUser', JSON.stringify(userToStore));
    setAppointments([]); // New user has no appointments
  };

  const addAppointment = (appointmentData: Omit<Appointment, 'id' | 'user' | 'status'>) => {
      if(!user) return;
      const newAppointment: Appointment = {
          ...appointmentData,
          id: appointments.length + 1,
          user: user.name,
          status: 'Pending',
      }
      const newAppointments = [...appointments, newAppointment];
      setAppointments(newAppointments);
      saveAppointments(user.email, newAppointments);
  }

  return (
    <AuthContext.Provider value={{ user, appointments, login, logout, signup, addAppointment }}>
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
