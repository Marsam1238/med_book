
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  addDoc,
  getDoc,
  onSnapshot,
  Timestamp,
  orderBy,
  FirestoreError,
} from 'firebase/firestore';


interface User {
  uid: string;
  phone: string;
  name?: string;
  address?: string;
}

export interface Appointment {
  id: string; // Firestore document ID
  user: {
    uid: string;
    name: string;
    phone: string;
    address: string;
  };
  item: string;
  type: 'Doctor' | 'Lab Test';
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed';
  clinic?: string;
  ticketNumber?: string;
  fees?: string;
  address?: string;
  createdAt: Timestamp;
}

interface UserDetails {
    name: string;
    address: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  appointments: Appointment[];
  login: (phone: string, password: string) => Promise<void>;
  signup: (phone: string, password: string, details: UserDetails) => Promise<void>;
  logout: () => void;
  addAppointment: (appointmentData: Omit<Appointment, 'id' | 'user' | 'status' | 'createdAt'>) => void;
  updateUserDetails: (details: UserDetails) => void;
  allAppointments: Appointment[];
  updateAppointment: (updatedAppointment: Partial<Appointment> & { id: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [userAppointments, setUserAppointments] = useState<Appointment[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check for persisted user
    const savedUser = localStorage.getItem('healthConnectUser');
    if (savedUser) {
      const parsedUser: User = JSON.parse(savedUser);
      const userDocRef = doc(db, 'users', parsedUser.uid);
      
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          setUser({ uid: docSnap.id, ...docSnap.data() } as User);
        } else {
          // User not in DB, clear local storage
          logout();
        }
        setLoading(false);
      }).catch((error: FirestoreError) => {
        console.error("Auth check failed:", error);
         if (error.code === 'permission-denied') {
            toast({
                variant: "destructive",
                title: "Database Access Denied",
                description: "Could not verify user. This is likely due to Firestore security rules.",
                duration: 10000,
            });
        }
        // Log out if we can't verify the user
        logout();
        setLoading(false);
      })
    } else {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Listen for all appointments in real-time
    const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const appointmentsData: Appointment[] = [];
      querySnapshot.forEach((doc) => {
        appointmentsData.push({ id: doc.id, ...doc.data() } as Appointment);
      });
      setAllAppointments(appointmentsData);
    }, (error: FirestoreError) => {
        if (error.code === 'permission-denied') {
            console.error("Firestore permission denied on appointments. Check your security rules.");
             toast({
                variant: "destructive",
                title: "Cannot Fetch Appointments",
                description: "Could not load appointments due to database security rules. Please update them in your Firebase Console.",
                duration: 10000,
            });
        }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  useEffect(() => {
    if (user) {
      const userApts = allAppointments.filter(apt => apt.user.uid === user.uid);
      setUserAppointments(userApts);
    } else {
      setUserAppointments([]);
    }
  }, [user, allAppointments]);
  

  const login = async (phone: string, password: string) => {
    if (phone.length !== 10) {
      throw new Error('Phone number must be 10 digits.');
    }
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('phone', '==', phone));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
        throw new Error('No account found with this phone number.');
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        
        // NOTE: In a real app, password would be hashed and checked on a server.
        // This is a simplified check for the demo.
        const passwordDocRef = doc(db, `user_passwords/${userDoc.id}`);
        const passwordSnap = await getDoc(passwordDocRef);

        if (!passwordSnap.exists() || passwordSnap.data().password !== password) {
        throw new Error('Invalid phone number or password.');
        }

        const loggedInUser: User = { uid: userDoc.id, ...userData } as User;
        setUser(loggedInUser);
        localStorage.setItem('healthConnectUser', JSON.stringify(loggedInUser));

        toast({ title: 'Login Successful' });
        router.push('/profile');
    } catch (error: any) {
        if (error instanceof FirestoreError && error.code === 'permission-denied') {
            toast({
                variant: "destructive",
                title: "Login Failed: Permission Denied",
                description: "The app could not access the database. Please check your Firestore security rules in the Firebase Console.",
                duration: 10000,
            });
        } else {
            // Re-throw other errors so the login page can catch them
            throw error;
        }
    }
  };

  const signup = async (phone: string, password: string, details: UserDetails) => {
    if (phone.length !== 10) {
        throw new Error('Phone number must be 10 digits.');
    }
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('phone', '==', phone));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        throw new Error('An account with this phone number already exists.');
    }

    const newUserRef = doc(collection(db, 'users'));
    const newUser: User = {
        uid: newUserRef.id,
        phone,
        ...details,
    };

    await setDoc(newUserRef, newUser);
    
    // Store password separately (again, simplified for demo)
    await setDoc(doc(db, `user_passwords/${newUserRef.id}`), { password });

    setUser(newUser);
    localStorage.setItem('healthConnectUser', JSON.stringify(newUser));
    toast({ title: 'Account created successfully!' });
    router.push('/profile');
  };

  const updateUserDetails = async (details: UserDetails) => {
    if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, details);
        const updatedUser = { ...user, ...details };
        setUser(updatedUser);
        localStorage.setItem('healthConnectUser', JSON.stringify(updatedUser));
        toast({ title: 'Profile updated!'});
        router.push('/profile');
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('healthConnectUser');
    toast({ title: "You have been logged out successfully." });
    router.push('/login');
  };

  const addAppointment = async (appointmentData: Omit<Appointment, 'id' | 'user' | 'status' | 'createdAt'>) => {
    if (!user || !user.name || !user.phone || !user.address) {
      toast({
        variant: 'destructive',
        title: 'Profile Incomplete',
        description: 'Please complete your profile before booking.',
      });
      return;
    }
    
    const newAppointment = {
        ...appointmentData,
        user: {
          uid: user.uid,
          name: user.name,
          phone: user.phone,
          address: user.address,
        },
        status: 'Pending' as 'Pending' | 'Confirmed',
        createdAt: Timestamp.now(),
    };
    await addDoc(collection(db, 'appointments'), newAppointment);
  };

  const updateAppointment = async (updatedAppointment: Partial<Appointment> & { id: string }) => {
    const { id, ...dataToUpdate } = updatedAppointment;
    const appointmentDocRef = doc(db, 'appointments', id);
    await updateDoc(appointmentDocRef, dataToUpdate);
  };

  return (
    <AuthContext.Provider value={{ user, loading, appointments: userAppointments, login, signup, logout, addAppointment, updateUserDetails, allAppointments, updateAppointment }}>
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
