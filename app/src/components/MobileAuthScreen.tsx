import React, { useState } from 'react';
import { Monitor, Hash } from 'lucide-react';
import { sb } from '../services/supabase';

interface Props {
  onDisplayCode: (schoolId: string) => void;
}

export const MobileAuthScreen: React.FC<Props> = ({ onDisplayCode }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    try {
      const schoolId = await sb.lookupByDisplayCode(code.trim());
      if (!schoolId) {
        setError('Code incorrect. Vérifiez le code fourni par votre établissement.');
        return;
      }
      onDisplayCode(schoolId);
    } catch {
      setError('Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center overflow-hidden px-6"
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

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #e8b84b, #d4a030)', boxShadow: '0 8px 40px rgba(232,184,75,0.35)' }}
          >
            🏫
          </div>
          <div className="text-center">
            <h1 className="font-syne text-2xl font-black text-white tracking-tight">
              Tableau<span className="text-gradient-gold">Scolaire</span>
            </h1>
            <p className="text-white/30 text-xs uppercase tracking-widest mt-1">Affichage numérique</p>
          </div>
        </div>

        {/* Card */}
        <div
          className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          style={{ background: '#0a1628' }}
        >
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/10"
            style={{ background: 'rgba(74,222,128,0.06)' }}>
            <Monitor className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span className="font-syne font-bold text-xs uppercase tracking-widest" style={{ color: '#4ade80' }}>
              Code établissement
            </span>
          </div>

          <form onSubmit={handleCode} className="p-5 space-y-4">
            <p className="text-white/50 text-xs leading-relaxed">
              Entrez le code fourni par votre établissement pour accéder à l'affichage.
            </p>

            <div className="relative">
              <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
              <input
                type="text"
                value={code}
                onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
                placeholder="Ex : A1B2C3"
                maxLength={8}
                required
                autoCapitalize="characters"
                className="w-full pl-10 pr-4 py-3.5 rounded-xl text-base text-white placeholder-white/25 focus:outline-none transition-colors font-mono tracking-widest text-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => e.target.style.borderColor = 'rgba(74,222,128,0.4)'}
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
              disabled={loading || !code.trim()}
              className="w-full py-3.5 rounded-xl font-syne font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)', color: '#0a1628' }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#0a1628]/40 border-t-[#0a1628] rounded-full animate-spin" />
              ) : (
                <><Monitor className="w-4 h-4" /> Accéder à l'affichage</>
              )}
            </button>
          </form>
        </div>

        <p className="text-white/15 text-xs uppercase tracking-widest text-center">
          ActuScolaire
        </p>
      </div>
    </div>
  );
};
