import React, { useState, useEffect } from 'react';
import { LogIn, UserPlus, Mail, Lock, Eye, EyeOff, Building2, Monitor, Hash, School } from 'lucide-react';
import { auth, AuthUser } from '../services/auth';
import { sb } from '../services/supabase';

interface Props {
  onAuth: (user: AuthUser) => void;
  onDisplayCode: (schoolId: string) => void;
}

type Tab = 'login' | 'register' | 'code';

export const AuthScreen: React.FC<Props> = ({ onAuth, onDisplayCode }) => {
  const [tab, setTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [uai, setUai] = useState('');
  const [code, setCode] = useState('');
  const [codeUai, setCodeUai] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    const check = () => setIsPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const reset = (nextTab: Tab) => {
    setTab(nextTab);
    setError('');
    setSuccess('');
    setPassword('');
    setCode('');
    setCodeUai('');
    setSchoolName('');
    setUai('');
  };

  const handleCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeUai.trim() || !code.trim()) return;
    setLoading(true);
    setError('');
    try {
      const schoolId = await sb.lookupByDisplayCode(codeUai.trim(), code.trim());
      if (!schoolId) {
        setError('UAI ou code incorrect. Vérifiez les informations fournies par votre établissement.');
        return;
      }
      onDisplayCode(schoolId);
    } catch {
      setError('Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (tab === 'register') {
        await auth.register(email, schoolName, uai);
        setSuccess('Inscription réussie ! Un mot de passe temporaire a été envoyé à votre adresse email.');
        setTab('login');
        setEmail('');
        setSchoolName('');
        setUai('');
      } else {
        const user = await auth.signIn(email, password);
        onAuth(user);
      }
    } catch (err: any) {
      const msg: string = err.message ?? '';
      if (msg.includes('Invalid login credentials')) {
        setError('Email ou mot de passe incorrect.');
      } else if (msg.includes('déjà avec cet email') || msg.includes('already')) {
        setError('Un compte existe déjà avec cet email. Connectez-vous.');
      } else {
        setError(msg || 'Une erreur est survenue.');
      }
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
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(232,184,75,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(232,184,75,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className={`flex flex-col items-center ${isPortrait ? 'mb-4' : 'mb-8'}`}>
          <div
            className={`${isPortrait ? 'w-10 h-10 mb-2' : 'w-16 h-16 mb-4'} rounded-2xl overflow-hidden shadow-2xl`}
            style={{ boxShadow: '0 8px 40px rgba(232,184,75,0.35)' }}
          >
            <img src="./icon.png" alt="AffichageScolaire" className="w-full h-full object-cover" />
          </div>
          <h1 className={`font-syne ${isPortrait ? 'text-base' : 'text-xl'} font-black text-white tracking-tight`}>
            Affichage<span className="text-gradient-gold">Scolaire</span>
          </h1>
          {!isPortrait && <p className="text-white/30 text-xs uppercase tracking-widest mt-1">Affichage numérique</p>}
        </div>

        {/* Card */}
        <div
          className="rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          style={{ background: 'linear-gradient(135deg, #0a1628, #0a1628)' }}
        >
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {([
              { key: 'login',    icon: <LogIn className="w-3.5 h-3.5" />,    label: 'Connexion' },
              { key: 'register', icon: <UserPlus className="w-3.5 h-3.5" />, label: 'Inscription' },
              { key: 'code',     icon: <Monitor className="w-3.5 h-3.5" />,  label: 'Affichage' },
            ] as { key: Tab; icon: React.ReactNode; label: string }[]).map(({ key, icon, label }) => (
              <button
                key={key}
                onClick={() => reset(key)}
                className={`flex-1 ${isPortrait ? 'py-2.5' : 'py-4'} text-xs font-bold font-syne flex items-center justify-center gap-1.5 transition-all`}
                style={{
                  color: tab === key ? (key === 'code' ? '#4ade80' : '#e8b84b') : 'rgba(255,255,255,0.3)',
                  borderBottom: tab === key ? `2px solid ${key === 'code' ? '#4ade80' : '#e8b84b'}` : '2px solid transparent',
                  background: tab === key ? (key === 'code' ? 'rgba(74,222,128,0.06)' : 'rgba(232,184,75,0.06)') : 'transparent',
                }}
              >
                {icon}{label}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className={isPortrait ? 'p-4' : 'p-7'}>
            {/* === Admin form === */}
            {tab !== 'code' && (
              <>
                {tab === 'register' && !isPortrait && (
                  <div className="flex items-start gap-3 mb-5 p-3.5 rounded-xl" style={{ background: 'rgba(232,184,75,0.07)', border: '1px solid rgba(232,184,75,0.15)' }}>
                    <Building2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <p className="text-white/60 text-xs leading-relaxed">
                      Créez un compte pour votre établissement. Chaque compte possède ses propres données entièrement séparées.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className={isPortrait ? 'space-y-3' : 'space-y-4'}>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(''); }}
                      placeholder="Email de l'établissement"
                      required
                      className={`w-full pl-10 pr-4 ${isPortrait ? 'py-2' : 'py-3'} rounded-xl text-sm text-white placeholder-white/25 focus:outline-none transition-colors`}
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(232,184,75,0.4)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>

                  {tab === 'register' && (
                    <>
                      <div className="relative">
                        <School className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                        <input
                          type="text"
                          value={schoolName}
                          onChange={e => { setSchoolName(e.target.value); setError(''); }}
                          placeholder="Nom de l'établissement"
                          required
                          className={`w-full pl-10 pr-4 ${isPortrait ? 'py-2' : 'py-3'} rounded-xl text-sm text-white placeholder-white/25 focus:outline-none transition-colors`}
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                          onFocus={e => e.target.style.borderColor = 'rgba(232,184,75,0.4)'}
                          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                      </div>
                      <div className="relative">
                        <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                        <input
                          type="text"
                          value={uai}
                          onChange={e => { setUai(e.target.value.toUpperCase()); setError(''); }}
                          placeholder="Code UAI (ex : 0594946A)"
                          required
                          className={`w-full pl-10 pr-4 ${isPortrait ? 'py-2' : 'py-3'} rounded-xl text-sm text-white placeholder-white/25 focus:outline-none transition-colors font-mono tracking-wider`}
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                          onFocus={e => e.target.style.borderColor = 'rgba(232,184,75,0.4)'}
                          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                      </div>
                    </>
                  )}

                  {tab === 'login' && (
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                      <input
                        type={showPwd ? 'text' : 'password'}
                        value={password}
                        onChange={e => { setPassword(e.target.value); setError(''); }}
                        placeholder="Mot de passe"
                        required
                        className={`w-full pl-10 pr-11 ${isPortrait ? 'py-2' : 'py-3'} rounded-xl text-sm text-white placeholder-white/25 focus:outline-none transition-colors`}
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
                  )}

                  {tab === 'register' && (
                    <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(232,184,75,0.07)', border: '1px solid rgba(232,184,75,0.15)' }}>
                      <Mail className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
                      <p className="text-white/50 text-xs leading-relaxed">
                        Un mot de passe temporaire vous sera envoyé par email.
                      </p>
                    </div>
                  )}


                  {error && (
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
                      <span className="text-red-400 text-xs">{error}</span>
                    </div>
                  )}
                  {success && (
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                      <span className="text-green-400 text-xs">{success}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !email || (tab === 'login' && !password) || (tab === 'register' && (!schoolName || !uai))}
                    className={`w-full ${isPortrait ? 'py-2' : 'py-3'} rounded-xl font-syne font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                    style={{ background: 'linear-gradient(135deg, #e8b84b, #d4a030)', color: '#0a1628' }}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-navy/40 border-t-navy rounded-full animate-spin" />
                    ) : (
                      <>{tab === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                      {tab === 'login' ? 'Se connecter' : 'Créer mon compte'}</>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* === Code d'affichage === */}
            {tab === 'code' && (
              <form onSubmit={handleCode} className={isPortrait ? 'space-y-3' : 'space-y-5'}>
                {!isPortrait && (
                  <div className="flex items-start gap-3 p-3.5 rounded-xl" style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.15)' }}>
                    <Monitor className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-white/60 text-xs leading-relaxed">
                      Entrez le code fourni par votre établissement pour accéder à l'affichage en lecture seule.
                    </p>
                  </div>
                )}

                <div className="relative">
                  <School className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                  <input
                    type="text"
                    value={codeUai}
                    onChange={e => { setCodeUai(e.target.value.toUpperCase()); setError(''); }}
                    placeholder="Code UAI (ex : 0594946A)"
                    required
                    className={`w-full pl-10 pr-4 ${isPortrait ? 'py-2' : 'py-3'} rounded-xl text-sm text-white placeholder-white/25 focus:outline-none transition-colors font-mono tracking-wider`}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(74,222,128,0.4)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>

                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                  <input
                    type="text"
                    value={code}
                    onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
                    placeholder="Code d'affichage (ex : A1B2C3)"
                    maxLength={8}
                    required
                    className={`w-full pl-10 pr-4 ${isPortrait ? 'py-2' : 'py-3'} rounded-xl text-sm text-white placeholder-white/25 focus:outline-none transition-colors font-mono tracking-widest text-center`}
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
                  disabled={loading || !codeUai.trim() || !code.trim()}
                  className={`w-full ${isPortrait ? 'py-2' : 'py-3'} rounded-xl font-syne font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)', color: '#0a1628' }}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-[#0a1628]/40 border-t-[#0a1628] rounded-full animate-spin" />
                  ) : (
                    <><Monitor className="w-4 h-4" /> Accéder à l'affichage</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        <p className={`text-center text-white/15 text-xs ${isPortrait ? 'mt-3' : 'mt-6'} uppercase tracking-widest`}>
          ActuScolaire
        </p>
      </div>
    </div>
  );
};
