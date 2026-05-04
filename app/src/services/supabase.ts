export const SUPABASE_URL = 'https://jsbhfainrsrghktqyanz.supabase.co';
export const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzYmhmYWlucnNyZ2hrdHF5YW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNjgxODksImV4cCI6MjA4ODg0NDE4OX0.-OpTPIKV5cT1sJu3iMZt4jDmP4Hme4keFnlia54-pvc';

let _token: string = SUPABASE_KEY;
let _schoolId: string | null = null;

export function setSession(token: string, schoolId: string) {
  _token = token;
  _schoolId = schoolId;
}

export function clearSession() {
  _token = SUPABASE_KEY;
  _schoolId = null;
}

export function setDisplayMode(schoolId: string) {
  _schoolId = schoolId;
}

export function getSchoolId(): string | null {
  return _schoolId;
}

function headers() {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${_token}`,
    'Content-Type': 'application/json',
  };
}

export const sb = {
  async select<T>(table: string, options: { order?: string; filter?: string } = {}): Promise<T[]> {
    let url = `${SUPABASE_URL}/rest/v1/${table}?`;
    if (_schoolId) url += `school_id=eq.${_schoolId}&`;
    if (options.order) url += `order=${options.order}&`;
    if (options.filter) url += `${options.filter}&`;
    url += 'select=*';
    const r = await fetch(url, { headers: headers() });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },

  async insert<T>(table: string, body: Partial<T>): Promise<T[]> {
    const payload = _schoolId ? { ...body, school_id: _schoolId } : body;
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: { ...headers(), 'Prefer': 'return=representation' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },

  async update<T>(table: string, match: Record<string, string>, body: Partial<T>): Promise<T[]> {
    const params = Object.entries(match).map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`).join('&');
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
      method: 'PATCH',
      headers: { ...headers(), 'Prefer': 'return=representation' },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },

  async upsert<T>(table: string, body: Partial<T>): Promise<T[]> {
    const payload = _schoolId ? { ...body, school_id: _schoolId } : body;
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: { ...headers(), 'Prefer': 'return=representation,resolution=merge-duplicates' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },

  async lookupByDisplayCode(uai: string, code: string): Promise<string | null> {
    const url = `${SUPABASE_URL}/rest/v1/school_settings?uai=eq.${encodeURIComponent(uai.toUpperCase())}&display_code=eq.${encodeURIComponent(code.toUpperCase())}&select=school_id`;
    const r = await fetch(url, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
    });
    if (!r.ok) return null;
    const rows = await r.json();
    return rows[0]?.school_id ?? null;
  },

  async delete(table: string, match: Record<string, string>): Promise<boolean> {
    const params = Object.entries(match).map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`).join('&');
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
      method: 'DELETE',
      headers: headers(),
    });
    if (!r.ok) throw new Error(await r.text());
    return true;
  },

  async uploadImage(path: string, file: File): Promise<string> {
    const r = await fetch(`${SUPABASE_URL}/storage/v1/object/slides/${path}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${_token}`,
        'Content-Type': file.type,
      },
      body: file,
    });
    if (!r.ok) throw new Error(await r.text());
    return `${SUPABASE_URL}/storage/v1/object/public/slides/${path}`;
  },
};
