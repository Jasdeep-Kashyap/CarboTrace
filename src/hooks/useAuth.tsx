import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { mockProfiles } from '@/lib/mock-data';
import type { Profile, UserRole } from '@/types/database';

interface AuthState {
  profile: Profile | null;
  isLoading: boolean;
}

interface AuthContext extends AuthState {
  login: (role: UserRole) => void;
  logout: () => void;
}

const Ctx = createContext<AuthContext | null>(null);

const STORAGE_KEY = 'carbotrace_demo_role';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ profile: null, isLoading: true });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as UserRole | null;
    if (saved) {
      const profile = mockProfiles.find(p => p.role === saved) ?? null;
      setState({ profile, isLoading: false });
    } else {
      setState({ profile: null, isLoading: false });
    }
  }, []);

  function login(role: UserRole) {
    const profile = mockProfiles.find(p => p.role === role) ?? mockProfiles[0];
    localStorage.setItem(STORAGE_KEY, role);
    setState({ profile, isLoading: false });
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setState({ profile: null, isLoading: false });
  }

  return <Ctx.Provider value={{ ...state, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
