
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { 
    onAuthStateChanged, 
    User as FirebaseUser,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
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
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, details: UserDetails) => Promise<void>;
  logout: () => void;
  addAppointment: (appointmentData: Omit<Appointment, 'id' | 'user' | 'status'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database for additional details
const userDetailsStore: { [key: string]: UserDetails } = {};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userDetails = userDetailsStore[firebaseUser.uid] || {};
        const currentUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          ...userDetails
        };
        setUser(currentUser);
        loadAppointments(currentUser.uid);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
  
  const handleAuthSuccess = (firebaseUser: FirebaseUser, details?: UserDetails) => {
    const userDetails = details || userDetailsStore[firebaseUser.uid] || {};
     if(details) {
        userDetailsStore[firebaseUser.uid] = details; // Save details
    }
    const currentUser: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        ...userDetails
    };
    setUser(currentUser);
    toast({ title: "Success", description: "Logged in successfully." });
    router.push('/profile');
  }

  const handleAuthError = (error: any) => {
    console.error("Authentication error:", error);
    toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "An unexpected error occurred.",
    });
    throw error;
  }

  const login = async (email: string, pass: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        handleAuthSuccess(userCredential.user);
    } catch (error) {
        handleAuthError(error);
    }
  }

  const signup = async (email: string, pass: string, details: UserDetails) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        handleAuthSuccess(userCredential.user, details);
    } catch(error) {
        handleAuthError(error);
    }
  }

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setAppointments([]);
      toast({ title: "Logged Out", description: "You have been logged out successfully."});
      router.push('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast({ variant: "destructive", title: "Logout Failed" });
    }
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
    <AuthContext.Provider value={{ user, loading, appointments, login, signup, logout, addAppointment }}>
      {!loading && children}
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
