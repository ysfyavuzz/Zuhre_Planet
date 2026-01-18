import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '@/lib/utils';

// Types
export interface User {
  id: string | number;
  name?: string;
  email: string;
  role: 'user' | 'escort' | 'admin' | 'client';
  avatar?: string;
  verified?: boolean;
  membership?: 'standard' | 'vip' | 'premium';
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isEscort: boolean;
  // Rol bazlı görüntüleme limitleri için
  viewRole: 'guest' | 'user' | 'premium' | 'vip';
  login: (emailOrUser: string | User, password?: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshToken: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'escort';
}

const AUTH_STORAGE_KEY = 'auth-user';
const TOKEN_STORAGE_KEY = 'auth-token';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Mock authentication service - replace with actual API calls
const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock response - replace with actual API call
    if (email === 'admin@example.com' && password === 'admin') {
      return {
        user: {
          id: 'admin-1',
          name: 'Admin',
          email: 'admin@example.com',
          role: 'admin',
          verified: true,
        },
        token: 'mock-admin-token',
      };
    }

    if (email === 'escort@example.com' && password === 'escort') {
      return {
        user: {
          id: 'escort-1',
          name: 'Ayşe Y.',
          email: 'escort@example.com',
          role: 'escort',
          verified: true,
          membership: 'vip',
        },
        token: 'mock-escort-token',
      };
    }

    // Mock user login
    return {
      user: {
        id: 'user-1',
        name: 'Ahmet Y.',
        email: email,
        role: 'user',
      },
      token: 'mock-user-token',
    };
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock response - replace with actual API call
    return {
      user: {
        id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: data.role || 'user',
        verified: false,
      },
      token: `mock-token-${Date.now()}`,
    };
  },

  async refreshToken(token: string): Promise<string> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock response - replace with actual API call
    return `refreshed-token-${Date.now()}`;
  },

  async verifyToken(token: string): Promise<User | null> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock response - replace with actual API call
    if (token.startsWith('mock-admin-token')) {
      return {
        id: 'admin-1',
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin',
        verified: true,
      };
    }

    if (token.startsWith('mock-escort-token')) {
      return {
        id: 'escort-1',
        name: 'Ayşe Y.',
        email: 'escort@example.com',
        role: 'escort',
        verified: true,
        membership: 'vip',
      };
    }

    if (token.startsWith('mock-user-token')) {
      return {
        id: 'user-1',
        name: 'Ahmet Y.',
        email: 'user@example.com',
        role: 'user',
      };
    }

    return null;
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Kullanıcının görüntüleme rolünü hesapla
  const viewRole = user?.membership === 'vip' ? 'vip'
    : user?.membership === 'premium' ? 'premium'
    : user ? 'user'
    : 'guest';

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = storage.get<User>(AUTH_STORAGE_KEY);
        const storedToken = storage.get<string>(TOKEN_STORAGE_KEY);

        if (storedUser && storedToken) {
          // Verify token is still valid
          const verifiedUser = await authService.verifyToken(storedToken);

          if (verifiedUser) {
            setUser(verifiedUser);
          } else {
            // Token is invalid, clear storage
            storage.remove(AUTH_STORAGE_KEY);
            storage.remove(TOKEN_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (emailOrUser: string | User, password?: string) => {
    // Support direct user object for testing
    if (typeof emailOrUser === 'object') {
      setUser(emailOrUser);
      storage.set(AUTH_STORAGE_KEY, emailOrUser);
      return;
    }

    const { user: loggedInUser, token } = await authService.login(emailOrUser, password!);

    storage.set(AUTH_STORAGE_KEY, loggedInUser);
    storage.set(TOKEN_STORAGE_KEY, token);

    setUser(loggedInUser);
  };

  const logout = () => {
    storage.remove(AUTH_STORAGE_KEY);
    storage.remove(TOKEN_STORAGE_KEY);
    setUser(null);
  };

  const register = async (data: RegisterData) => {
    const { user: registeredUser, token } = await authService.register(data);

    storage.set(AUTH_STORAGE_KEY, registeredUser);
    storage.set(TOKEN_STORAGE_KEY, token);

    setUser(registeredUser);
  };

  const updateProfile = async (data: Partial<User>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedUser = { ...user!, ...data };
    storage.set(AUTH_STORAGE_KEY, updatedUser);
    setUser(updatedUser);
  };

  const refreshToken = async () => {
    const storedToken = storage.get<string>(TOKEN_STORAGE_KEY);

    if (!storedToken) {
      throw new Error('No token found');
    }

    const newToken = await authService.refreshToken(storedToken);
    storage.set(TOKEN_STORAGE_KEY, newToken);
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isAdmin: user?.role === 'admin',
    isEscort: user?.role === 'escort',
    viewRole,
    login,
    logout,
    register,
    updateProfile,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

// HOC to protect routes that require authentication
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: 'user' | 'escort' | 'admin'
) {
  return function ProtectedComponent(props: P) {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Giriş Gerekli</h2>
            <p className="text-gray-600 mb-4">Bu sayfaya erişmek için giriş yapmalısınız.</p>
            <a href="/login" className="text-pink-600 hover:underline">
              Giriş Yap
            </a>
          </div>
        </div>
      );
    }

    if (requiredRole && user?.role !== requiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Yetki Gerekli</h2>
            <p className="text-gray-600">Bu sayfaya erişmek için gerekli yetkiye sahip değilsiniz.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
