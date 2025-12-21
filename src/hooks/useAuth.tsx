import { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

interface User {
  id: string;
  email: string;
  username?: string;
  profileImage?: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  userRole: 'admin' | 'user' | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = apiClient.getToken();
    if (token) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getCurrentUser();

      setUser(data.user);
      setUserRole(data.user.role);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Token might be invalid, clear it
      apiClient.setToken(null);
      setUser(null);
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchUserData();
  };

  const signOut = async () => {
    try {
      await apiClient.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setUser(null);
      setUserRole(null);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signOut,
    userRole,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};