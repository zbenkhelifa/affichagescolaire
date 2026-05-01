import React, { useState, useEffect } from 'react';
import { School } from '../types';
import { Settings, LogOut } from 'lucide-react';

interface Props {
  school: School;
  onAdminClick?: () => void;
  onExit?: () => void;
}

export const Topbar: React.FC<Props> = ({ school, onAdminClick, onExit }) => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [dayLabel, setDayLabel] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' }));
      setDayLabel(now.toLocaleDateString('fr-FR', { weekday: 'long' }));
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  const isEmoji = school.logo.length <= 4 && !/^https?:\/\//.test(school.logo) && !school.logo.startsWith('data:');

  return (
    <div
      className="relative z-10 flex items-center justify-between px-10 py-4 flex-shrink-0"
      style={{
        background: 'linear-gradient(135deg, rgba(26,58,107,0.92) 0%, rgba(9,9,11,0.96) 100%)',
        borderBottom: '3px solid #e8b84b',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* School info */}
      <div className="flex items-center gap-5">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #e8b84b, #d4a030)',
            boxShadow: '0 4px 20px rgba(232,184,75,0.4)',
            fontSize: isEmoji ? '2rem' : undefined,
          }}
        >
          {isEmoji ? (
            <span>{school.logo}</span>
          ) : (
            <img src={school.logo} alt="Logo" className="w-full h-full object-cover" />
          )}
        </div>
        <div>
          <h1 className="font-syne text-2xl font-black text-white tracking-wide leading-tight">
            {school.name}
          </h1>
          <p className="text-accent text-sm font-medium tracking-widest uppercase mt-0.5">
            {school.subtitle}
          </p>
        </div>
      </div>

      {/* Date & time */}
      <div className="flex gap-3 items-center">
        <div
          className="px-5 py-2.5 rounded-2xl text-center"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(232,184,75,0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="font-syne text-lg font-bold text-white capitalize">{date}</div>
          <div className="text-xs uppercase tracking-widest text-white/40 mt-0.5 capitalize">{dayLabel}</div>
        </div>
        <div
          className="px-5 py-2.5 rounded-2xl text-center"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(232,184,75,0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="font-syne text-4xl font-black text-accent leading-none tracking-wide">{time}</div>
          <div className="text-xs uppercase tracking-widest text-white/40 mt-1">Heure</div>
        </div>
      </div>

      {/* Right: live + admin */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse-dot" />
          <span className="text-green-400 text-sm font-black uppercase tracking-widest">Live</span>
        </div>
        {onAdminClick && (
          <button
            onClick={onAdminClick}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Settings className="w-4 h-4" />
            Admin
          </button>
        )}
        {onExit && (
          <button
            onClick={onExit}
            title="Quitter (Echap)"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/40 hover:text-white/80 transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <LogOut className="w-4 h-4" />
            Quitter
          </button>
        )}
      </div>
    </div>
  );
};
