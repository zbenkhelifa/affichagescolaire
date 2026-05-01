import React, { useState } from 'react';
import { Home, UserX, Calendar, PartyPopper, UtensilsCrossed, Settings, LogOut } from 'lucide-react';
import { AppData } from '../types';
import { Slideshow } from '../components/Slideshow';
import { Ticker } from '../components/Ticker';

type Tab = 'accueil' | 'absences' | 'agenda' | 'evenements' | 'cantine';

const TABS: { id: Tab; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: 'accueil',    label: 'Accueil',    Icon: Home },
  { id: 'absences',   label: 'Absences',   Icon: UserX },
  { id: 'agenda',     label: 'Agenda',     Icon: Calendar },
  { id: 'evenements', label: 'Événements', Icon: PartyPopper },
  { id: 'cantine',    label: 'Cantine',    Icon: UtensilsCrossed },
];

interface Props {
  data: AppData;
  isLoading: boolean;
  onAdminClick?: () => void;
  onExit?: () => void;
}

function shortDate(s: string) {
  if (!s) return '—';
  const [, m, d] = s.split('-');
  return `${d}/${m}`;
}

const JOURS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

const SectionTitle = ({ icon, label, color }: { icon: string; label: string; color: string }) => (
  <div
    className="flex items-center gap-2 px-3 py-2 sticky top-0 z-10"
    style={{ background: 'rgba(8,15,30,0.97)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(232,184,75,0.1)' }}
  >
    <span className="text-base">{icon}</span>
    <span className="font-syne font-black text-[10px] uppercase tracking-widest" style={{ color }}>{label}</span>
  </div>
);

const Empty = ({ msg }: { msg: string }) => (
  <div className="flex flex-col items-center justify-center py-16 px-8 text-center text-white/20">
    <div className="text-4xl mb-3">📋</div>
    <p className="text-sm">{msg}</p>
  </div>
);

const Spinner = () => (
  <div className="flex items-center justify-center py-16">
    <div className="w-7 h-7 rounded-full border-4 border-white/10 border-t-yellow-400 animate-spin" />
  </div>
);

export const MobileDisplayMode: React.FC<Props> = ({ data, isLoading, onAdminClick, onExit }) => {
  const [activeTab, setActiveTab] = useState<Tab>('accueil');

  const today = new Date().toISOString().slice(0, 10);
  const in14d = (() => { const d = new Date(); d.setDate(d.getDate() + 14); return d.toISOString().slice(0, 10); })();

  const absences   = data.absences.filter(a => a.date >= today);
  const conseils   = data.conseils.filter(c => c.date >= today);
  const sorties    = data.sorties.filter(s => s.date >= today);
  const evenements = data.evenements.filter(e => e.date >= today);
  const cantine    = data.cantine.filter(c => c.date >= today && c.date <= in14d);

  const badges: Record<Tab, number> = {
    accueil:    0,
    absences:   absences.filter(a => a.date === today).length,
    agenda:     conseils.length + sorties.length,
    evenements: evenements.length,
    cantine:    cantine.length,
  };

  const isEmoji = data.school.logo.length <= 4
    && !/^https?:\/\//.test(data.school.logo)
    && !data.school.logo.startsWith('data:');

  /* ── Tabs ─────────────────────────────────────────────────────────── */

  const tabAccueil = () => (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div
        className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, rgba(26,58,107,0.97), rgba(9,9,11,0.99))', borderBottom: '1px solid #e8b84b' }}
      >
        <div
          className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#e8b84b,#d4a030)', fontSize: isEmoji ? '1rem' : undefined }}
        >
          {isEmoji ? <span>{data.school.logo}</span> : <img src={data.school.logo} alt="" className="w-full h-full object-cover" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-syne font-black text-white text-xs truncate leading-tight">{data.school.name}</div>
          {data.school.subtitle && <div className="text-[10px] truncate leading-tight" style={{ color: '#e8b84b' }}>{data.school.subtitle}</div>}
        </div>
        {onAdminClick && (
          <button onClick={onAdminClick} className="p-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <Settings className="w-3.5 h-3.5 text-white/40" />
          </button>
        )}
        {onExit && (
          <button onClick={onExit} className="p-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <LogOut className="w-3.5 h-3.5 text-white/40" />
          </button>
        )}
      </div>
      <div className="flex-1 relative overflow-hidden">
        {isLoading
          ? <div className="w-full h-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-white/10 border-t-yellow-400 rounded-full animate-spin" /></div>
          : <Slideshow slides={data.slides} />
        }
      </div>
      <Ticker items={data.ticker} config={data.config} compact />
    </div>
  );

  const tabAbsences = () => (
    <div className="flex-1 overflow-y-auto">
      <SectionTitle icon="🚫" label="Absences" color="#ef4444" />
      {isLoading ? <Spinner /> : absences.length === 0 ? (
        <Empty msg="Aucune absence signalée" />
      ) : (
        <div className="p-3 space-y-2">
          {absences.map(a => {
            const isToday = a.date === today;
            return (
              <div key={a.id} className="rounded-2xl p-3.5 flex items-start gap-3"
                style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' }}>
                <div className="rounded-xl px-2.5 py-1.5 text-center flex-shrink-0"
                  style={{ background: isToday ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)', border: `1px solid ${isToday ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`, minWidth: 50 }}>
                  <div className="text-xs font-bold uppercase" style={{ color: isToday ? '#ef4444' : 'rgba(241,245,249,0.4)' }}>
                    {isToday ? 'Auj.' : shortDate(a.date)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white">{a.nom}</div>
                  <div className="text-white/50 text-sm mt-0.5">
                    {[a.matiere, a.classes, a.remplacement !== 'non' ? a.remplacement : ''].filter(Boolean).join(' · ')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const tabAgenda = () => (
    <div className="flex-1 overflow-y-auto">
      <SectionTitle icon="📅" label="Conseils de classe" color="#e8b84b" />
      {isLoading ? <Spinner /> : conseils.length === 0 ? (
        <Empty msg="Aucun conseil à venir" />
      ) : (
        <div className="p-3 space-y-2">
          {conseils.map(c => (
            <div key={c.id} className="rounded-2xl p-3.5 flex items-center justify-between"
              style={{ background: 'rgba(232,184,75,0.06)', border: '1px solid rgba(232,184,75,0.14)' }}>
              <div>
                <div className="font-bold text-white">{c.classe}</div>
                {c.trim && <div className="text-xs text-white/40 mt-0.5">{c.trim}</div>}
              </div>
              <div className="text-right">
                <div className="font-bold text-sm" style={{ color: '#e8b84b' }}>
                  {shortDate(c.date)}{c.heure ? ` · ${c.heure}` : ''}
                </div>
                {c.salle && <div className="text-xs text-white/30 mt-0.5">{c.salle}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      <SectionTitle icon="🚌" label="Sorties scolaires" color="#4ade80" />
      {isLoading ? <Spinner /> : sorties.length === 0 ? (
        <Empty msg="Aucune sortie prévue" />
      ) : (
        <div className="p-3 space-y-2">
          {sorties.map(s => (
            <div key={s.id} className="rounded-2xl p-3.5 flex items-start gap-3"
              style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)' }}>
              <div className="rounded-xl px-2.5 py-1.5 text-center flex-shrink-0 font-bold"
                style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', fontSize: '0.8rem', minWidth: 50 }}>
                {shortDate(s.date)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white">{s.titre}</div>
                <div className="text-white/50 text-sm mt-0.5">{[s.classes, s.lieu].filter(Boolean).join(' · ')}</div>
                {s.heure && <div className="text-xs text-white/30 mt-0.5">Départ {s.heure}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const tabEvenements = () => (
    <div className="flex-1 overflow-y-auto">
      <SectionTitle icon="🎉" label="Événements" color="#a78bfa" />
      {isLoading ? <Spinner /> : evenements.length === 0 ? (
        <Empty msg="Aucun événement à venir" />
      ) : (
        <div className="p-3 space-y-2">
          {evenements.map(e => (
            <div key={e.id} className="rounded-2xl p-3.5 flex items-start gap-3"
              style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.18)' }}>
              <div className="rounded-xl px-2.5 py-1.5 text-center flex-shrink-0 font-bold"
                style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa', fontSize: '0.8rem', minWidth: 50 }}>
                {shortDate(e.date)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white">{e.titre}</div>
                <div className="text-white/50 text-sm mt-0.5">{[e.lieu, e.heure].filter(Boolean).join(' · ')}</div>
                {e.desc && <div className="text-xs text-white/40 mt-1 leading-relaxed">{e.desc}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const tabCantine = () => (
    <div className="flex-1 overflow-y-auto">
      <SectionTitle icon="🍽" label="Menu cantine" color="#4ade80" />
      {isLoading ? <Spinner /> : cantine.length === 0 ? (
        <Empty msg="Aucun menu disponible cette semaine" />
      ) : (
        <div className="p-3 space-y-2">
          {cantine.map(c => {
            const [y, mo, d] = c.date.split('-').map(Number);
            const day = JOURS[new Date(y, mo - 1, d).getDay()];
            return (
              <div key={c.id} className="rounded-2xl p-3.5"
                style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.18)' }}>
                <div className="inline-flex items-center px-3 py-1 rounded-xl font-bold text-sm mb-2.5"
                  style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>
                  {day} {d}/{mo}
                </div>
                <div className="space-y-1">
                  {c.entree  && <div className="text-white/60 text-sm">🥗 {c.entree}</div>}
                  {c.plat    && <div className="font-bold text-white">🍽 {c.plat}</div>}
                  {c.accomp  && <div className="text-white/60 text-sm">🌾 {c.accomp}</div>}
                  {c.fromage && <div className="text-white/60 text-sm">🧀 {c.fromage}</div>}
                  {c.dessert && <div className="text-white/60 text-sm">🍮 {c.dessert}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#0a1628' }}>
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'accueil'    && tabAccueil()}
        {activeTab === 'absences'   && tabAbsences()}
        {activeTab === 'agenda'     && tabAgenda()}
        {activeTab === 'evenements' && tabEvenements()}
        {activeTab === 'cantine'    && tabCantine()}
      </div>

      {/* Bottom navigation bar */}
      <div
        className="flex-shrink-0 flex"
        style={{ background: '#080f1e', borderTop: '1px solid rgba(232,184,75,0.12)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {TABS.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          const badge  = badges[id];
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex-1 flex flex-col items-center justify-center py-1.5 relative transition-colors"
              style={{ color: active ? '#e8b84b' : 'rgba(241,245,249,0.3)' }}
            >
              {active && (
                <div className="absolute top-0 left-1/4 right-1/4 h-0.5 rounded-b-full" style={{ background: '#e8b84b' }} />
              )}
              <div className="relative">
                <Icon className="w-4 h-4" />
                {badge > 0 && (
                  <div
                    className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center font-black"
                    style={{ background: '#ef4444', color: '#fff', fontSize: '0.5rem' }}
                  >
                    {badge > 9 ? '9+' : badge}
                  </div>
                )}
              </div>
              <span className="mt-0.5 font-medium" style={{ fontSize: '0.55rem' }}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
