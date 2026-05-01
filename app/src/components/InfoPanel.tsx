import React, { useEffect, useRef } from 'react';
import { AppData } from '../types';

interface Props {
  data: AppData;
  compact?: boolean;
}

const SCROLL_SPEED = 0.6; // px par frame

function shortDate(dateStr: string) {
  if (!dateStr) return '—';
  const [, m, d] = dateStr.split('-');
  return `${d}/${m}`;
}

function fs(config: Record<string, string>, section: string): number {
  return parseFloat(config['font_size_' + section] || '1.1');
}

export const InfoPanel: React.FC<Props> = ({ data, compact = false }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);
  const yRef     = useRef(0);

  const today = new Date().toISOString().slice(0, 10);
  const nextWeekStr = (() => { const d = new Date(); d.setDate(d.getDate() + 14); return d.toISOString().slice(0, 10); })();
  const JOURS = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];

  const recentAbsences   = data.absences.filter(a => a.date >= today);
  const upcomingConseils = data.conseils.filter(c => c.date >= today);
  const upcomingSorties  = data.sorties.filter(s => s.date >= today);
  const upcomingEvts     = data.evenements.filter(e => e.date >= today);
  const upcomingCantine  = data.cantine.filter(c => c.date >= today && c.date <= nextWeekStr);
  const hasContent = !!(recentAbsences.length || upcomingConseils.length || upcomingSorties.length || upcomingEvts.length || upcomingCantine.length);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    const track = trackRef.current;
    if (!track || !hasContent) return;
    yRef.current = 0;
    track.style.transform = 'translateY(0)';

    const step = () => {
      const halfH = track.scrollHeight / 2;
      if (halfH > 0) {
        yRef.current += SCROLL_SPEED;
        if (yRef.current >= halfH) yRef.current = 0;
        track.style.transform = `translateY(-${yRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [data, hasContent]);

  const Sep = ({ icon, label, color, bg }: { icon: string; label: string; color: string; bg: string }) => (
    compact ? (
      <div className="flex items-center gap-1.5 px-3 py-1 flex-shrink-0" style={{ background: 'rgba(0,0,0,0.25)', borderBottom: `1px solid ${color}22` }}>
        <div className="w-5 h-5 rounded flex items-center justify-center text-xs flex-shrink-0" style={{ background: bg }}>{icon}</div>
        <div className="flex-1 h-px" style={{ background: `${color}33` }} />
      </div>
    ) : (
      <div className="flex items-center gap-2.5 px-4 py-2 flex-shrink-0" style={{ background: 'rgba(0,0,0,0.18)', borderBottom: '1px solid rgba(232,184,75,0.1)' }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: bg }}>{icon}</div>
        <span className="font-syne text-xs font-black uppercase tracking-widest" style={{ color }}>{label}</span>
      </div>
    )
  );

  const blockContent = () => {
    if (!hasContent) return null;
    const fontAbsences  = fs(data.config, 'absences');
    const fontConseils  = fs(data.config, 'conseils');
    const fontSorties   = fs(data.config, 'sorties');
    const fontEvts      = fs(data.config, 'evenements');
    const fontCantine   = fs(data.config, 'cantine');

    return (
      <>
        {/* ── Absences ── */}
        {recentAbsences.length > 0 && (
          <>
            <Sep icon="🚫" label={(() => {
              const t = recentAbsences.filter(a => a.date === today).length;
              const f = recentAbsences.filter(a => a.date > today).length;
              return t && f ? `Absences — ${t} aujourd'hui, ${f} à venir` : t ? "Absences — aujourd'hui" : 'Absences à venir';
            })()} color="#ef4444" bg="rgba(239,68,68,0.2)" />
            {recentAbsences.map(a => {
              const isToday = a.date === today;
              return compact ? (
                <div key={`abs-${a.id}`} className="flex items-center gap-2 px-3 py-1 border-b border-white/5">
                  <span className="text-xs font-bold flex-shrink-0" style={{ color: isToday ? '#ef4444' : 'rgba(241,245,249,0.4)', minWidth: 28 }}>
                    {isToday ? 'Auj.' : shortDate(a.date)}
                  </span>
                  <span className="font-bold text-white truncate" style={{ fontSize: `${fontAbsences * 0.82}rem` }}>{a.nom}</span>
                  <span className="text-white/40 truncate ml-auto" style={{ fontSize: `${fontAbsences * 0.72}rem` }}>
                    {[a.matiere, a.classes].filter(Boolean).join(' · ')}
                  </span>
                </div>
              ) : (
                <div key={`abs-${a.id}`} className="flex items-center gap-3 mx-3.5 my-1.5 rounded-xl p-2.5" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                  <div className="flex-shrink-0 rounded-lg px-2.5 py-1 text-center" style={{ background: isToday ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.07)', border: `1px solid ${isToday ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.1)'}`, minWidth: 52 }}>
                    <div style={{ fontSize: `${fontAbsences * 0.65}rem`, fontWeight: 700, color: isToday ? '#ef4444' : 'rgba(241,245,249,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {isToday ? "Auj." : shortDate(a.date)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white truncate" style={{ fontSize: `${fontAbsences}rem` }}>{a.nom}</div>
                    <div className="text-white/50 truncate" style={{ fontSize: `${fontAbsences * 0.8}rem` }}>
                      {[a.matiere, a.classes, a.remplacement !== 'non' ? a.remplacement : ''].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* ── Conseils ── */}
        {upcomingConseils.length > 0 && (
          <>
            <Sep icon="📅" label="Conseils de classe" color="#e8b84b" bg="rgba(232,184,75,0.2)" />
            {upcomingConseils.map(c => compact ? (
              <div key={`cc-${c.id}`} className="flex items-center justify-between px-3 py-1 border-b border-white/5">
                <span className="font-bold text-white truncate" style={{ fontSize: `${fontConseils * 0.82}rem` }}>{c.classe}</span>
                <span className="flex-shrink-0 ml-2 font-bold" style={{ color: '#e8b84b', fontSize: `${fontConseils * 0.78}rem` }}>
                  {shortDate(c.date)}{c.heure ? ` · ${c.heure}` : ''}
                </span>
              </div>
            ) : (
              <div key={`cc-${c.id}`} className="flex justify-between items-center px-5 py-3 border-b border-white/5">
                <div>
                  <span className="font-bold text-white" style={{ fontSize: `${fontConseils}rem` }}>{c.classe}</span>
                  {c.trim && <span className="ml-2 text-white/40" style={{ fontSize: `${fontConseils * 0.8}rem` }}>{c.trim}</span>}
                </div>
                <div className="text-right">
                  <div style={{ color: '#e8b84b', fontSize: `${fontConseils * 0.9}rem`, fontWeight: 700 }}>
                    {shortDate(c.date)}{c.heure ? ` · ${c.heure}` : ''}
                  </div>
                  {c.salle && <div className="text-white/30" style={{ fontSize: `${fontConseils * 0.75}rem` }}>{c.salle}</div>}
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── Sorties ── */}
        {upcomingSorties.length > 0 && (
          <>
            <Sep icon="🚌" label="Sorties scolaires" color="#4ade80" bg="rgba(74,222,128,0.2)" />
            {upcomingSorties.map(s => compact ? (
              <div key={`sort-${s.id}`} className="flex items-center gap-2 px-3 py-1 border-b border-white/5">
                <span className="flex-shrink-0 font-bold" style={{ color: '#4ade80', fontSize: `${fontSorties * 0.78}rem`, minWidth: 34 }}>{shortDate(s.date)}</span>
                <span className="font-bold text-white truncate" style={{ fontSize: `${fontSorties * 0.82}rem` }}>{s.titre}</span>
                <span className="text-white/40 truncate ml-auto" style={{ fontSize: `${fontSorties * 0.72}rem` }}>{s.classes}</span>
              </div>
            ) : (
              <div key={`sort-${s.id}`} className="flex gap-4 px-5 py-3 border-b border-white/5 items-start">
                <div className="rounded-xl px-2.5 py-1 text-center flex-shrink-0 font-bold" style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.25)', color: '#4ade80', fontSize: `${fontSorties * 0.85}rem`, minWidth: 48 }}>
                  {shortDate(s.date)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white" style={{ fontSize: `${fontSorties}rem` }}>{s.titre}</div>
                  <div className="text-white/50" style={{ fontSize: `${fontSorties * 0.85}rem` }}>{[s.classes, s.lieu].filter(Boolean).join(' · ')}</div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── Événements ── */}
        {upcomingEvts.length > 0 && (
          <>
            <Sep icon="🎉" label="Événements" color="#a78bfa" bg="rgba(147,139,250,0.2)" />
            {upcomingEvts.map(e => compact ? (
              <div key={`evt-${e.id}`} className="flex items-center gap-2 px-3 py-1 border-b border-white/5">
                <span className="flex-shrink-0 font-bold" style={{ color: '#a78bfa', fontSize: `${fontEvts * 0.78}rem`, minWidth: 34 }}>{shortDate(e.date)}</span>
                <span className="font-bold text-white truncate" style={{ fontSize: `${fontEvts * 0.82}rem` }}>{e.titre}</span>
                <span className="text-white/40 flex-shrink-0 ml-auto" style={{ fontSize: `${fontEvts * 0.72}rem` }}>{e.heure}</span>
              </div>
            ) : (
              <div key={`evt-${e.id}`} className="flex gap-4 px-5 py-3 border-b border-white/5 items-start">
                <div className="rounded-xl px-2.5 py-1 text-center flex-shrink-0 font-bold" style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.25)', color: '#a78bfa', fontSize: `${fontEvts * 0.85}rem`, minWidth: 48 }}>
                  {shortDate(e.date)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white" style={{ fontSize: `${fontEvts}rem` }}>{e.titre}</div>
                  <div className="text-white/50" style={{ fontSize: `${fontEvts * 0.85}rem` }}>{[e.lieu, e.heure].filter(Boolean).join(' · ')}</div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── Cantine ── */}
        {upcomingCantine.length > 0 && (
          <>
            <Sep icon="🍽" label="Menu cantine" color="#4ade80" bg="rgba(34,197,94,0.2)" />
            {upcomingCantine.map(c => {
              const [y, m, d] = c.date.split('-').map(Number);
              const dayName = JOURS[new Date(y, m - 1, d).getDay()];
              return compact ? (
                <div key={`cant-${c.id}`} className="flex items-center gap-2 px-3 py-1 border-b border-white/5">
                  <span className="flex-shrink-0 font-bold" style={{ color: '#4ade80', fontSize: `${fontCantine * 0.78}rem`, minWidth: 34 }}>{dayName} {d}/{m}</span>
                  <span className="font-bold text-white truncate" style={{ fontSize: `${fontCantine * 0.82}rem` }}>{c.plat}</span>
                  {c.dessert && <span className="text-white/40 flex-shrink-0 ml-auto truncate" style={{ fontSize: `${fontCantine * 0.72}rem` }}>{c.dessert}</span>}
                </div>
              ) : (
                <div key={`cant-${c.id}`} className="flex gap-4 px-5 py-3 border-b border-white/5 items-start">
                  <div className="rounded-xl px-2.5 py-1 text-center flex-shrink-0 font-bold" style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', minWidth: 44 }}>
                    <div style={{ fontSize: `${fontCantine * 0.85}rem` }}>{dayName}</div>
                    <div style={{ fontSize: `${fontCantine * 0.7}rem` }}>{d}/{m}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    {c.entree  && <div className="text-white/60" style={{ fontSize: `${fontCantine * 0.9}rem` }}>🥗 {c.entree}</div>}
                    {c.plat    && <div className="font-bold text-white" style={{ fontSize: `${fontCantine}rem` }}>🍽 {c.plat}</div>}
                    {c.accomp  && <div className="text-white/60" style={{ fontSize: `${fontCantine * 0.9}rem` }}>🌾 {c.accomp}</div>}
                    {c.fromage && <div className="text-white/60" style={{ fontSize: `${fontCantine * 0.9}rem` }}>🧀 {c.fromage}</div>}
                    {c.dessert && <div className="text-white/60" style={{ fontSize: `${fontCantine * 0.9}rem` }}>🍮 {c.dessert}</div>}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </>
    );
  };

  return (
    <div
      className="flex flex-col overflow-hidden h-full"
      style={{
        borderLeft: compact ? 'none' : '1px solid rgba(232,184,75,0.12)',
        borderTop: compact ? '1px solid rgba(232,184,75,0.2)' : 'none',
        background: compact ? 'rgba(6,10,20,0.97)' : 'var(--bg-info-panel, rgba(9,9,11,0.5))',
      }}
    >
      <div className="flex-1 overflow-hidden relative">
        {!hasContent ? (
          <div className="flex flex-col items-center justify-center h-full text-white/20 text-center p-10">
            <div className="text-5xl mb-3">📋</div>
            <p className="text-sm leading-relaxed">Aucune information à afficher.<br />Ajoutez du contenu depuis l'administration.</p>
          </div>
        ) : (
          <div ref={trackRef} className="flex flex-col">
            <div>{blockContent()}</div>
            <div aria-hidden="true">{blockContent()}</div>
          </div>
        )}
      </div>
    </div>
  );
};
