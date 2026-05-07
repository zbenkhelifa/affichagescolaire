import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY, setSession, clearSession, sb } from './supabase';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export type AuthUser = {
  id: string;
  email: string;
  mustChangePassword?: boolean;
};

export const auth = {
  async signIn(email: string, password: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    if (!data.user || !data.session) throw new Error('Connexion échouée');
    setSession(data.session.access_token, data.user.id);
    return {
      id: data.user.id,
      email: data.user.email!,
      mustChangePassword: data.user.user_metadata?.must_change_password === true,
    };
  },

  async register(email: string, schoolName: string, uai: string): Promise<void> {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({ email, schoolName, uai }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Inscription échouée');
  },

  async changePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
      data: { must_change_password: false },
    });
    if (error) throw new Error(error.message);
  },

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
    clearSession();
  },

  async getSession(): Promise<AuthUser | null> {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return null;
    setSession(data.session.access_token, data.session.user.id);
    return {
      id: data.session.user.id,
      email: data.session.user.email!,
      mustChangePassword: data.session.user.user_metadata?.must_change_password === true,
    };
  },

  onAuthChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session.access_token, session.user.id);
        callback({
          id: session.user.id,
          email: session.user.email!,
          mustChangePassword: session.user.user_metadata?.must_change_password === true,
        });
      } else {
        clearSession();
        callback(null);
      }
    });
  },
};
