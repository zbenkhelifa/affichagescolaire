import React, { useState } from 'react';
import { AppData } from '../../types';
import { AdminNav, AdminPanel } from './AdminNav';
import { HomePanel } from './panels/HomePanel';
import { ConseilsPanel } from './panels/ConseilsPanel';
import { AbsencesPanel } from './panels/AbsencesPanel';
import { SortiesPanel } from './panels/SortiesPanel';
import { EvenementsPanel } from './panels/EvenementsPanel';
import { CantinePanel } from './panels/CantinePanel';
import { DiaporamaPanel } from './panels/DiaporamaPanel';
import { BandeauPanel } from './panels/BandeauPanel';
import { SettingsPanel } from './panels/SettingsPanel';
import { Monitor, LogOut } from 'lucide-react';

interface Props {
  data: AppData;
  userEmail: string;
  onDataChange: () => void;
  onLogout: () => void;
  onDisplayMode: () => void;
}

export const AdminMode: React.FC<Props> = ({ data, userEmail, onDataChange, onLogout, onDisplayMode }) => {
  const [activePanel, setActivePanel] = useState<AdminPanel>('home');

  const renderPanel = () => {
    switch (activePanel) {
      case 'home': return <HomePanel data={data} onNavigate={setActivePanel} />;
      case 'conseils': return <ConseilsPanel conseils={data.conseils} onRefresh={onDataChange} />;
      case 'absences': return <AbsencesPanel absences={data.absences} onRefresh={onDataChange} />;
      case 'sorties': return <SortiesPanel sorties={data.sorties} onRefresh={onDataChange} />;
      case 'evenements': return <EvenementsPanel evenements={data.evenements} onRefresh={onDataChange} />;
      case 'cantine': return <CantinePanel cantine={data.cantine} onRefresh={onDataChange} />;
      case 'diaporama': return <DiaporamaPanel slides={data.slides} onRefresh={onDataChange} />;
      case 'bandeau': return <BandeauPanel ticker={data.ticker} onRefresh={onDataChange} />;
      case 'settings': return <SettingsPanel school={data.school} config={data.config} onRefresh={onDataChange} />;
      default: return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: '#07080f' }}>
      {/* Admin top bar */}
      <div
        className="flex items-center justify-between px-7 py-3.5 flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #0a1628, #0a1628)', borderBottom: '2px solid #e8b84b' }}
      >
        <h1 className="font-syne text-base font-black text-white flex items-center gap-3">
          <span className="text-gradient-gold">🏫</span>
          <span className="text-white/70">Administration</span>
          {data.school.name && (
            <>
              <span className="text-gradient-gold">—</span>
              <span className="text-gradient-gold">{data.school.name}</span>
            </>
          )}
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-white/20 text-xs hidden md:block">{userEmail}</span>
          <button
            onClick={onDisplayMode}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white/60 hover:text-white transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Monitor className="w-4 h-4" />
            Vue affichage
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: 'rgba(239,68,68,0.8)' }}
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body: sidebar + panels */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        <AdminNav activePanel={activePanel} onNavigate={setActivePanel} onLogout={onLogout} onDisplayMode={onDisplayMode} />

        <div className="flex-1 overflow-y-auto p-7 scrollbar-thin">
          {renderPanel()}
        </div>
      </div>
    </div>
  );
};
