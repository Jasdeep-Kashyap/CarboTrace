import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { mockProfiles, mockOrgs } from '@/lib/mock-data';
import type { Profile, Organisation, UserRole, OrgType } from '@/types/database';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export interface RegisterData {
  role: UserRole;
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  orgName?: string;
  orgType?: string;
  city?: string;
  state?: string;
  gstin?: string;
}

interface AuthState {
  profile: Profile | null;
  isLoading: boolean;
}

interface AuthContext extends AuthState {
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
}

const Ctx = createContext<AuthContext | null>(null);

const STORAGE_KEY = 'carbotrace_demo_role';
const CUSTOM_PROFILE_KEY = 'carbotrace_custom_profile';
const CUSTOM_ORG_KEY = 'carbotrace_custom_org';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ profile: null, isLoading: true });

  useEffect(() => {
    // Check if custom registered profile exists
    try {
      const customProfileJson = localStorage.getItem(CUSTOM_PROFILE_KEY);
      if (customProfileJson) {
        const customProfile = JSON.parse(customProfileJson) as Profile;
        if (customProfile && customProfile.role) {
          // Restore custom org if available
          const customOrgJson = localStorage.getItem(CUSTOM_ORG_KEY);
          if (customOrgJson) {
            const customOrg = JSON.parse(customOrgJson) as Organisation;
            if (!mockOrgs.some(o => o.id === customOrg.id)) {
              mockOrgs.unshift(customOrg);
            }
          }
          if (!mockProfiles.some(p => p.id === customProfile.id)) {
            mockProfiles.unshift(customProfile);
          }
          setState({ profile: customProfile, isLoading: false });
          return;
        }
      }
    } catch {
      // Ignore parse errors and fallback
    }

    const saved = localStorage.getItem(STORAGE_KEY) as UserRole | null;
    // Default to 'generator' so demo visitors are never blocked
    const roleToUse = saved ?? 'generator';
    const profile = mockProfiles.find(p => p.role === roleToUse) ?? mockProfiles[0];
    setState({ profile, isLoading: false });
  }, []);

  function login(role: UserRole) {
    const customProfileJson = localStorage.getItem(CUSTOM_PROFILE_KEY);
    if (customProfileJson) {
      try {
        const customProfile = JSON.parse(customProfileJson) as Profile;
        if (customProfile.role === role) {
          localStorage.setItem(STORAGE_KEY, role);
          setState({ profile: customProfile, isLoading: false });
          return;
        }
      } catch {
        // Fallback to mock profiles
      }
    }
    const profile = mockProfiles.find(p => p.role === role) ?? mockProfiles[0];
    localStorage.setItem(STORAGE_KEY, role);
    setState({ profile, isLoading: false });
  }

  function switchRole(role: UserRole) {
    login(role);
  }

  async function register(data: RegisterData): Promise<{ success: boolean; error?: string }> {
    try {
      const now = new Date().toISOString();
      const orgId = data.orgName?.trim() ? `org-reg-${Date.now()}` : null;

      let newOrg: Organisation | null = null;
      if (orgId && data.orgName) {
        newOrg = {
          id: orgId,
          name: data.orgName.trim(),
          type: (data.orgType as OrgType) || (data.role === 'generator' ? 'hotel' : data.role === 'recycler' ? 'recycler' : data.role === 'buyer' ? 'buyer' : 'logistics'),
          address: data.city ? `${data.city}, India` : 'Bengaluru, Karnataka',
          city: data.city?.trim() || 'Bengaluru',
          state: data.state?.trim() || 'Karnataka',
          pincode: '560001',
          gstin: data.gstin?.trim() || null,
          contact_email: data.email.trim(),
          contact_phone: data.phone?.trim() || '+91-9876543210',
          logo_url: null,
          verified: true,
          tier: 'pro',
          total_co2e_kg: 0,
          total_waste_kg: 0,
          created_at: now,
        };
        mockOrgs.unshift(newOrg);
        localStorage.setItem(CUSTOM_ORG_KEY, JSON.stringify(newOrg));
      }

      const newProfile: Profile = {
        id: `profile-reg-${Date.now()}`,
        user_id: `user-${Date.now()}`,
        full_name: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        role: data.role,
        org_id: orgId,
        phone: data.phone?.trim() || null,
        avatar_url: null,
        created_at: now,
        updated_at: now,
      };

      mockProfiles.unshift(newProfile);
      localStorage.setItem(STORAGE_KEY, data.role);
      localStorage.setItem(CUSTOM_PROFILE_KEY, JSON.stringify(newProfile));

      // If Supabase is connected, attempt remote signup asynchronously in background without blocking
      if (isSupabaseConfigured && data.password) {
        try {
          supabase.auth.signUp({
            email: data.email.trim(),
            password: data.password,
            options: {
              data: {
                full_name: data.fullName,
                role: data.role,
                org_name: data.orgName,
              },
            },
          }).catch(err => {
            console.warn('Supabase auth signup error (gracefully fallen back to local storage):', err);
          });
        } catch (sbErr) {
          console.warn('Supabase signup invocation warning:', sbErr);
        }
      }

      setState({ profile: newProfile, isLoading: false });
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      return { success: false, error: msg };
    }
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CUSTOM_PROFILE_KEY);
    localStorage.removeItem(CUSTOM_ORG_KEY);
    // Keep a fallback guest demo profile available
    setState({ profile: mockProfiles[0], isLoading: false });
  }

  return <Ctx.Provider value={{ ...state, login, logout, switchRole, register }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
