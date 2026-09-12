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
  switchRole: (role: UserRole) => void;
}

const Ctx = createContext<AuthContext | null>(null);

const STORAGE_KEY = 'carbotrace_demo_role';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ profile: null, isLoading: true });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as UserRole | null;
    // Default to 'generator' so demo visitors are never blocked
    const roleToUse = saved ?? 'generator';
    const profile = mockProfiles.find(p => p.role === roleToUse) ?? mockProfiles[0];
    setState({ profile, isLoading: false });
  }, []);

  function login(role: UserRole) {
    const profile = mockProfiles.find(p => p.role === role) ?? mockProfiles[0];
    localStorage.setItem(STORAGE_KEY, role);
    setState({ profile, isLoading: false });
  }

  function switchRole(role: UserRole) {
    login(role);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    // Keep a fallback guest demo profile available
    setState({ profile: mockProfiles[0], isLoading: false });
  }

  return <Ctx.Provider value={{ ...state, login, logout, switchRole }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
