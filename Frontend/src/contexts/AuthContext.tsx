import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  business_name: string | null;
  industry: string | null;
  brand_voice: string | null;
  languages: string[] | null;
  is_setup_complete: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profile — never throws, returns null on any failure
  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (error || !data) return null;
      return data as UserProfile;
    } catch {
      return null;
    }
  }, []);

  // Load session + profile, then set isLoading=false. Always completes.
  const handleSession = useCallback(async (session: Session | null) => {
    if (session?.user) {
      setUser(session.user);
      const p = await fetchProfile(session.user.id);
      setProfile(p);
    } else {
      setUser(null);
      setProfile(null);
    }
  }, [fetchProfile]);

  useEffect(() => {
    let cancelled = false;

    // 1) Bootstrap: read whatever session exists (or null), then clear loading.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      handleSession(session).finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    });

    // 2) React to future auth events (login, logout, token refresh).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (cancelled) return;
        handleSession(session);
      },
    );

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [handleSession]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const p = await fetchProfile(user.id);
    setProfile(p);
  }, [user, fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
