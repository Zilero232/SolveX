import type { Session, User } from '@supabase/supabase-js';

import { create } from 'zustand';

import { supabase } from '@/shared/api';

export type UserRole = 'admin' | 'user';

interface AuthState {
  isLoading: boolean;
  role: UserRole;
  session: Session | null;
  user: User | null;
  setSession: (session: Session | null) => void;
}

const readRole = (user: User | null | undefined): UserRole =>
  user?.app_metadata?.role === 'admin' ? 'admin' : 'user';

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  role: 'user',
  isLoading: true,
  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
      role: readRole(session?.user),
      isLoading: false,
    }),
}));

export const bootstrapAuth = async () => {
  const { data } = await supabase.auth.getSession();

  useAuthStore.getState().setSession(data.session);

  supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.getState().setSession(session);
  });
};
