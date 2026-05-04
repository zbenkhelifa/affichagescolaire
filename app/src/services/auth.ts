import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY, setSession, clearSession, sb } from './supabase';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export type AuthUser = {
  id: string;
  email: string;
};

export const auth = {
  async signIn(email: string, password: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    if (!data.user || !data.session) throw new Error('Connexion échouée');
    setSession(data.session.access_token, data.user.id);
    return { id: data.user.id, email: data.user.email! };
  },

  async signUp(email: string, password: string, schoolName: string, uai: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("Inscription échouée.");
    if (!data.session) throw new Error("CONFIRM_EMAIL");
    setSession(data.session.access_token, data.user.id);
    await sb.upsert('school_settings', { name: schoolName, uai: uai.toUpperCase(), logo: '🏫', subtitle: '' } as any);
    return { id: data.user.id, email: data.user.email! };
  },

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
    clearSession();
  },

  async getSession(): Promise<AuthUser | null> {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return null;
    setSession(data.session.access_token, data.session.user.id);
    return { id: data.session.user.id, email: data.session.user.email! };
  },

  onAuthChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session.access_token, session.user.id);
        callback({ id: session.user.id, email: session.user.email! });
      } else {
        clearSession();
        callback(null);
      }
    });
  },
};
