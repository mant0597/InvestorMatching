import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any, role: 'investor' | 'startup') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication for demonstration - would be replaced with actual API calls
const mockAuth = {
  login: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate successful login
    if (email && password) {
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: email.includes('investor') ? 'investor' : 'startup',
        createdAt: new Date()
      };
      
      return mockUser;
    }
    
    throw new Error('Invalid credentials');
  },
  register: async (userData: any, role: 'investor' | 'startup') => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate successful registration
    const mockUser: User = {
      id: '1',
      email: userData.email,
      name: userData.name,
      role,
      createdAt: new Date()
    };
    
    return mockUser;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const user = await mockAuth.login(email, password);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any, role: 'investor' | 'startup') => {
    setLoading(true);
    try {
      const user = await mockAuth.register(userData, role);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};