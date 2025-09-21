
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { 
    onAuthStateChanged, 
    User as FirebaseUser,
    signInWithPhoneNumber,
    RecaptchaVerifier,
    ConfirmationResult
} from 'firebase/auth';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

interface User {
  uid: string;
  phoneNumber: string | null;
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
  loginWithPhone: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => void;
  addAppointment: (appointmentData: Omit<Appointment, 'id' | 'user' | 'status'>) => void;
  updateUserDetails: (details: UserDetails) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database for additional details
const userDetailsStore: { [key: string]: UserDetails } = {};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userDetails = userDetailsStore[firebaseUser.uid] || {};
        const currentUser: User = {
          uid: firebaseUser.uid,
          phoneNumber: firebaseUser.phoneNumber,
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
  
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
    return window.recaptchaVerifier;
  }

  const loginWithPhone = async (phone: string) => {
    const loadingToast = toast.loading('Sending OTP...');
    try {
        const appVerifier = setupRecaptcha();
        const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
        window.confirmationResult = confirmationResult;
        toast.dismiss(loadingToast);
        toast.success('OTP sent successfully!');
    } catch(error: any) {
        toast.dismiss(loadingToast);
        console.error("OTP Error:", error);

        if (error.code === 'auth/invalid-phone-number') {
            toast.error('Invalid phone number provided. Please check the format.');
        } else if (error.code === 'auth/too-many-requests') {
            toast.error('Too many requests. Please try again later.');
        } else if (error.code === 'auth/configuration-not-found' || error.code === 'auth/billing-not-enabled') {
             toast.error('App configuration error. Please contact support.');
        }
        else {
            toast.error('Failed to send OTP. Please try again.');
        }
        // Reset reCAPTCHA if it exists to allow retries
        window.recaptchaVerifier?.clear();
        throw error;
    }
  }

  const verifyOtp = async (otp: string) => {
    const loadingToast = toast.loading('Verifying OTP...');
    try {
      if(window.confirmationResult) {
        const result = await window.confirmationResult.confirm(otp);
        const firebaseUser = result.user;
        const userDetails = userDetailsStore[firebaseUser.uid] || {};
        const currentUser: User = {
          uid: firebaseUser.uid,
          phoneNumber: firebaseUser.phoneNumber,
          ...userDetails
        };
        setUser(currentUser);
        toast.dismiss(loadingToast);
        toast.success('Logged in successfully!');
        
        // Redirect logic after login
        const hasCompletedProfile = userDetails.name && userDetails.address;
        if(hasCompletedProfile) {
          router.push('/profile');
        } else {
          router.push('/signup');
        }
      } else {
         throw new Error("No confirmation result found. Please try sending the OTP again.");
      }
    } catch(error: any) {
        toast.dismiss(loadingToast);
        console.error("OTP Verification Error:", error);
        if(error.code === 'auth/invalid-verification-code'){
            toast.error('Invalid OTP. Please try again.');
        } else {
            toast.error('Failed to verify OTP. Please try again.');
        }
        throw error;
    }
  }

  const updateUserDetails = (details: UserDetails) => {
      if(user) {
          userDetailsStore[user.uid] = details;
          const updatedUser = { ...user, ...details };
          setUser(updatedUser);
          toast.success("Profile updated!");
          router.push('/profile');
      }
  }

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setAppointments([]);
      toast.success("You have been logged out successfully.");
      router.push('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout Failed");
    }
  };

  const addAppointment = (appointmentData: Omit<Appointment, 'id' | 'user' | 'status'>) => {
      if(!user) return;
      const newAppointment: Appointment = {
          ...appointmentData,
          id: appointments.length + 1,
          user: user.name || user.phoneNumber || 'Unknown',
          status: 'Pending',
      }
      const newAppointments = [...appointments, newAppointment];
      setAppointments(newAppointments);
      saveAppointments(user.uid, newAppointments);
  }

  return (
    <AuthContext.Provider value={{ user, loading, appointments, loginWithPhone, verifyOtp, logout, addAppointment, updateUserDetails }}>
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
