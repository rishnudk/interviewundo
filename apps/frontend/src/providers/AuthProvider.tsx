'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import type { LoginDTO, RegisterDTO, AuthResponseDTO } from '@interviewprep/shared-types';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginDTO) => Promise<void>;
  register: (details: RegisterDTO) => Promise<void>;
  logout: () => void;
  apiFetch: <T>(path: string, options?: RequestInit) => Promise<T>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { data: session, status: sessionStatus } = useSession();

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    if (sessionStatus === 'authenticated') {
      signOut();
    }
  }, [sessionStatus]);

  const refreshSession = useCallback(
    async (existingRefreshToken: string) => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/refreshToken`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: existingRefreshToken }),
        });

        if (!response.ok) throw new Error('Token refresh failed');

        const payload = await response.json();
        if (payload.success && payload.data) {
          const { accessToken, refreshToken: newRefreshToken } = payload.data;
          setToken(accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Restore user from localStorage if it's there
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          return accessToken;
        } else {
          throw new Error('Invalid refresh response structure');
        }
      } catch (err) {
        logout();
        return null;
      }
    },
    [logout],
  );

  // Helper to check if a JWT access token is expired or expiring in <= 15 seconds
  const isJwtExpired = (jwtToken: string): boolean => {
    try {
      const parts = jwtToken.split('.');
      if (parts.length !== 3) return true;
      const payload = JSON.parse(atob(parts[1]));
      if (!payload.exp) return false;
      return payload.exp * 1000 <= Date.now() + 15000;
    } catch {
      return true;
    }
  };

  // Synchronize Next-Auth session
  useEffect(() => {
    const syncSession = async () => {
      if (sessionStatus === 'authenticated' && session?.accessToken && session?.user) {
        if (session.refreshToken) {
          localStorage.setItem('refreshToken', session.refreshToken as string);
        }

        const storedRt = localStorage.getItem('refreshToken');
        if (isJwtExpired(session.accessToken as string) && storedRt) {
          await refreshSession(storedRt);
        } else {
          setToken(session.accessToken as string);
          setUser({
            id: session.user.id,
            name: session.user.name || 'GitHub User',
            email: session.user.email || '',
            role: session.user.role || 'STUDENT',
            image: session.user.image,
          });
        }
        setLoading(false);
      }
    };
    syncSession();
  }, [session, sessionStatus, refreshSession]);

  // Periodic silent refresh (runs every 14 minutes since JWT expiry is 15 minutes)
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(
      async () => {
        const rt = localStorage.getItem('refreshToken');
        if (rt) {
          await refreshSession(rt);
        }
      },
      14 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [token, refreshSession]);

  // Initial boot check
  useEffect(() => {
    const initializeAuth = async () => {
      if (sessionStatus === 'loading') return;
      if (sessionStatus === 'authenticated') return;

      const rt = localStorage.getItem('refreshToken');
      if (rt) {
        await refreshSession(rt);
      }
      setLoading(false);
    };

    initializeAuth();
  }, [refreshSession, sessionStatus]);

  const login = async (credentials: LoginDTO) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.error?.message || 'Login failed');
      }

      const { user: userData, accessToken, refreshToken } = payload.data as AuthResponseDTO;
      setUser(userData);
      setToken(accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      setLoading(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (details: RegisterDTO) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });

      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.error?.message || 'Registration failed');
      }

      const { user: userData, accessToken, refreshToken } = payload.data as AuthResponseDTO;
      setUser(userData);
      setToken(accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      setLoading(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const apiFetch = useCallback(
    async <T,>(path: string, options: RequestInit = {}): Promise<T> => {
      const headers = new Headers(options.headers || {});
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
      }

      let response = await fetch(`${BACKEND_URL}${path}`, {
        ...options,
        headers,
      });

      // Handle token expiration / 401
      if (response.status === 401) {
        const rt = localStorage.getItem('refreshToken');
        if (rt) {
          const newAccessToken = await refreshSession(rt);
          if (newAccessToken) {
            headers.set('Authorization', `Bearer ${newAccessToken}`);
            response = await fetch(`${BACKEND_URL}${path}`, {
              ...options,
              headers,
            });
          }
        }
      }

      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.error?.message || 'API request failed');
      }

      return payload.data as T;
    },
    [token, refreshSession],
  );

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, apiFetch }}>
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
