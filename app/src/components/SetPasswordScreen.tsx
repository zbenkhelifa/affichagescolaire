import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { auth } from '../services/auth';

interface Props {
  onDone: () => void;
}

export const SetPasswordScreen: React.FC<Props> = ({ onDone }) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
    if (password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return; }
    setLoading(true);
    try {
      await auth.changePassword(password);
      onDone();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 20% 20%, #0a1628 0%, #0a1628 60%), radial-gradient(ellipse at 80% 80%, #1a3a6b 0%, transparent 60%)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(232,184,75,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(232,184,75,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 mb-4 rounded-2xl overflow-hidden shadow-2xl"
            style={{ boxShadow: '0 8px 40px rgba(232,184,75,0.35)' }}
          >
            <img src="./icon.png" alt="AffichageScolaire" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-syne text-xl font-black text-white tracking-tight">
            Affichage<span className="text-gradient-gold">Scolaire</span>
          </h1>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          style={{ background: '#0a1628' }}
        >
          <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10" style={{ background: 'rgba(232,184,75,0.06)' }}>
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span className="font-syne font-bold text-sm text-accent uppercase tracking-widest">Première connexion</span>
          </div>

          <div className="p-7">
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Bienvenue ! Définissez un mot de passe permanent pour sécuriser votre compte.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Nouveau mot de passe"
                  required
                  autoFocus
                  className="w-full pl-10 pr-11 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(232,184,75,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => { setConfirm(e.target.value); setError(''); }}
                  placeholder="Confirmer le mot de passe"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(232,184,75,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  <span className="text-red-400 text-xs">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !password || !confirm}
                className="w-full py-3 rounded-xl font-syne font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #e8b84b, #d4a030)', color: '#0a1628' }}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-navy/40 border-t-navy rounded-full animate-spin" />
                ) : (
                  <><ShieldCheck className="w-4 h-4" /> Définir mon mot de passe</>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-white/15 text-xs mt-6 uppercase tracking-widest">
          ActuScolaire
        </p>
      </div>
    </div>
  );
};
