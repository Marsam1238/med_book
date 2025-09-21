
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import toast from 'react-hot-toast';

declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier;
        confirmationResult?: any;
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

interface AuthContextType {
  user: User | null;
  loading: boolean;
  appointments: Appointment[];
  loginWithPhone: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => void;
  addAppointment: (appointmentData: Omit<Appointment, 'id' | 'user' | 'status'>) => void;
  updateUserProfile: (details: {name: string, address: string}) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database for additional details
const userDetailsStore: { [key: string]: { name: string; address: string } } = {
    // Example: '+11234567890': { name: 'Test User', address: '123 Test St' }
};

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
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log("recaptcha solved");
        }
      });
    }
    return window.recaptchaVerifier;
  }

  const loginWithPhone = async (phone: string) => {
    try {
        const appVerifier = setupRecaptcha();
        const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
        window.confirmationResult = confirmationResult;
        toast.success('OTP sent successfully!');
    } catch(error) {
        console.error("Error sending OTP:", error);
        toast.error('Failed to send OTP. Please make sure to use a valid phone number with country code.');
        // Reset reCAPTCHA so user can try again.
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.render().then((widgetId) => {
                // @ts-ignore
                if(window.grecaptcha) {
                    // @ts-ignore
                    window.grecaptcha.reset(widgetId);
                }
            });
        }
    }
  };

  const verifyOtp = async (otp: string) => {
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
            
            if(!currentUser.name) {
                toast.success('Login successful! Please complete your profile.');
                router.push('/signup');
            } else {
                toast.success('Login successful!');
                router.push('/profile');
            }
        }
    } catch(error) {
        console.error("Error verifying OTP:", error);
        toast.error('Invalid OTP. Please try again.');
    }
  }

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setAppointments([]);
      toast.success('Logged out successfully.');
      router.push('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error('Failed to log out.');
    }
  };

  const updateUserProfile = (details: {name: string, address: string}) => {
    if (user) {
        const updatedUser = {...user, ...details};
        setUser(updatedUser);
        userDetailsStore[user.uid] = details; // Store details
        toast.success('Profile updated successfully!');
        router.push('/profile');
    }
  }

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
    <AuthContext.Provider value={{ user, loading, appointments, loginWithPhone, verifyOtp, logout, addAppointment, updateUserProfile }}>
      {!loading && children}
      <div id="recaptcha-container"></div>
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
