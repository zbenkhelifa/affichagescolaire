import React, { useState } from 'react';
import { AppData } from '../../../types';
import { AdminPanel } from '../AdminNav';
import { Calendar, UserX, Bus, PartyPopper, UtensilsCrossed, Image, Radio, Copy, Check } from 'lucide-react';

interface Stat {
  label: string;
  key: keyof AppData;
  icon: React.ReactNode;
  color: string;
  panel: AdminPanel;
}

const STATS: Stat[] = [
  { label: 'Conseils', key: 'conseils', icon: <Calendar className="w-5 h-5" />, color: '#e8b84b', panel: 'conseils' },
  { label: 'Absences', key: 'absences', icon: <UserX className="w-5 h-5" />, color: '#ef4444', panel: 'absences' },
  { label: 'Sorties', key: 'sorties', icon: <Bus className="w-5 h-5" />, color: '#4ade80', panel: 'sorties' },
  { label: 'Événements', key: 'evenements', icon: <PartyPopper className="w-5 h-5" />, color: '#a78bfa', panel: 'evenements' },
  { label: 'Cantine', key: 'cantine', icon: <UtensilsCrossed className="w-5 h-5" />, color: '#4ade80', panel: 'cantine' },
  { label: 'Diapositives', key: 'slides', icon: <Image className="w-5 h-5" />, color: '#60a5fa', panel: 'diaporama' },
  { label: 'Bandeau', key: 'ticker', icon: <Radio className="w-5 h-5" />, color: '#f472b6', panel: 'bandeau' },
];

interface Props {
  data: AppData;
  onNavigate: (panel: AdminPanel) => void;
}

export const HomePanel: React.FC<Props> = ({ data, onNavigate }) => {
  const today = new Date().toISOString().slice(0, 10);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(data.school.displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCount = (key: keyof AppData) => {
    const arr = data[key] as any[];
    if (!Array.isArray(arr)) return 0;
    if (key === 'slides' || key === 'ticker') return arr.length;
    return arr.filter((item: any) => item.date >= today).length;
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-syne text-2xl font-black text-white">Tableau de bord</h2>
        <p className="text-white/40 text-sm mt-1">Sélectionnez une section pour gérer le contenu affiché</p>
      </div>

      <div className="grid grid-cols-3 gap-4 xl:grid-cols-4">
        {STATS.map(stat => {
          const count = getCount(stat.key);
          return (
            <button
              key={stat.label}
              onClick={() => onNavigate(stat.panel)}
              className="text-left p-5 rounded-2xl transition-all hover:-translate-y-1"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLElement).style.borderColor = `${stat.color}40`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              <div className="flex items-center gap-2 mb-4 text-white/40" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <div className="font-syne text-3xl font-black" style={{ color: stat.color }}>{count}</div>
              <div className="text-white text-sm font-semibold mt-1">{stat.label}</div>
              <div className="text-white/30 text-xs mt-0.5">
                {stat.key === 'slides' || stat.key === 'ticker' ? 'au total' : 'à venir'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Display code */}
      <div className="mt-8 p-5 rounded-2xl" style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)' }}>
        <p className="text-[11px] font-black uppercase tracking-widest text-green-400/70 mb-3">
          🔑 Code d'affichage élèves
        </p>
        {data.school.displayCode ? (
          <div className="flex items-center gap-3">
            <div
              className="flex-1 py-3 rounded-xl text-center font-mono text-3xl font-black tracking-[0.4em]"
              style={{ background: 'rgba(74,222,128,0.1)', border: '2px solid rgba(74,222,128,0.3)', color: '#4ade80' }}
            >
              {data.school.displayCode}
            </div>
            <button
              onClick={copyCode}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all"
              style={{ background: copied ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: copied ? '#4ade80' : 'rgba(241,245,249,0.6)' }}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copié !' : 'Copier'}
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('settings')}
            className="text-sm text-white/40 hover:text-white/70 transition-colors underline underline-offset-2"
          >
            Configurer l'établissement pour générer le code →
          </button>
        )}
        <p className="text-white/30 text-xs mt-3">Donnez ce code aux élèves — accès affichage uniquement, sans admin.</p>
      </div>

      {/* School info */}
      <div className="mt-4 p-5 rounded-2xl" style={{ background: 'rgba(232,184,75,0.06)', border: '1px solid rgba(232,184,75,0.12)' }}>
        <h3 className="font-syne text-sm font-black text-accent uppercase tracking-widest mb-2">
          🏫 {data.school.name || 'Établissement non configuré'}
        </h3>
        <p className="text-white/40 text-sm">{data.school.subtitle}</p>
      </div>
    </div>
  );
};
