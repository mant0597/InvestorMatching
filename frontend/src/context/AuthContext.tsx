// ...existing code...
import React from 'react';
import { useNavigate } from 'react-router-dom';

type User = { id: string; email: string; name?: string };

const AuthContext = React.createContext<any>(null);

const TOKEN_KEY = 'innova_token';
const API_BASE = (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:4000';

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers, credentials: 'include' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.message || res.statusText);
    (err as any).status = res.status;
    (err as any).body = body;
    throw err;
  }
  return res.json().catch(() => ({}));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  const isAuthenticated = Boolean(user);

  // try to refresh access token using httpOnly cookie on startup
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // call refresh to get access token if cookie present
        const r = await fetch(`${API_BASE}/api/auth/refresh`, { method: 'POST', credentials: 'include' });
        if (r.ok) {
          const data = await r.json();
          if (data.accessToken) localStorage.setItem(TOKEN_KEY, data.accessToken);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
        // then call me
        const me = await apiFetch('/api/auth/me', { method: 'GET' });
        if (mounted) setUser(me.user ?? null);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const login = async (creds: { email: string; password: string }) => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(creds),
      });
      if (data.accessToken) localStorage.setItem(TOKEN_KEY, data.accessToken);
      setUser(data.user ?? null);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: { email: string; password: string; name?: string }) => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (data.accessToken) localStorage.setItem(TOKEN_KEY, data.accessToken);
      setUser(data.user ?? null);
      navigate('/complete-profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: any) => {
    // Optimistically update the user state
    setUser((prev) => prev ? { ...prev, ...profileData } : null);
    
    // Optional: Call backend to persist the profile
    try {
      const data = await apiFetch('/api/auth/profile', {
        method: 'POST',
        body: JSON.stringify(profileData),
      });
      setUser(data.user ?? null);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch {}
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};