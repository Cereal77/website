import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  mobileNo?: string;
  fullName?: string;
  email?: string;
  name?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUserFromBackend: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Basic validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Simulate successful login
    const newUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!name || !email || !password) {
      throw new Error('All fields are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Simulate successful registration
    const newUser: User = {
      id: '1',
      email,
      name,
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const setUserFromBackend = (userData: User) => {
    setUser(userData);
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Load user from localStorage on mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, register, logout, setUserFromBackend }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
