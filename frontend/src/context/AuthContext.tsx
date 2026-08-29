import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient, { AUTH_TOKEN_KEY } from '@/api/client';
import type { User } from '@/types';
import type { AuthContextType, LoginRequest, LoginResponse, RegistrationRequest } from '@/features/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiClient.get<User>('/users/me');
        setUser(response.data);
      } catch {
        // Token invalid, expired, or network error with 401
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<User> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    const token = response.data.access_token;

    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setAccessToken(token);

    // Fetch user profile with newly set token
    const userResponse = await apiClient.get<User>('/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUser(userResponse.data);
    return userResponse.data;
  };

  const register = async (data: RegistrationRequest): Promise<void> => {
    await apiClient.post<User>('/users/', data);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}