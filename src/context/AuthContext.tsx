
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  email: string;
  address: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  signup: (details: Omit<User, ''> & { password?: string }) => void;
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
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in from a previous session (e.g., localStorage)
    const storedUser = localStorage.getItem('healthConnectUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userToStore } = foundUser;
      setUser(userToStore);
      localStorage.setItem('healthConnectUser', JSON.stringify(userToStore));
    } else {
      throw new Error('Invalid email or password');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('healthConnectUser');
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
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
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
