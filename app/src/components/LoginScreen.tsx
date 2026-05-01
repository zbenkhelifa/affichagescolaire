import React, { useState, useRef, useEffect } from 'react';
import { Lock, X, LogIn } from 'lucide-react';

interface Props {
  onLogin: (password: string) => boolean;
  onClose: () => void;
}

export const LoginScreen: React.FC<Props> = ({ onLogin, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const ok = onLogin(password);
      if (!ok) {
        setError(true);
        setPassword('');
        setLoading(false);
        inputRef.current?.focus();
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-sm mx-4 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        style={{ background: 'linear-gradient(135deg, #0a1628, #0a1628)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(232,184,75,0.15)', border: '1px solid rgba(232,184,75,0.25)' }}
            >
              <Lock className="w-6 h-6 text-accent" />
            </div>
            <h2 className="font-syne text-xl font-black text-white">Accès administrateur</h2>
            <p className="text-white/40 text-sm mt-1">Entrez le mot de passe</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(false); }}
                placeholder="Mot de passe"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-accent/50 transition-colors text-sm"
              />
              {error && (
                <p className="text-accent2 text-xs mt-2 flex items-center gap-1">
                  <span>✕</span> Mot de passe incorrect
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-xl font-syne font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: loading || !password ? 'rgba(232,184,75,0.3)' : 'linear-gradient(135deg, #e8b84b, #d4a030)',
                color: '#0a1628',
              }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Connexion
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
