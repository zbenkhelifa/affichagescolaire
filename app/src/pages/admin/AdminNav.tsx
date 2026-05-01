import React from 'react';
import { LayoutDashboard, Calendar, UserX, Bus, PartyPopper, UtensilsCrossed, Image, Radio, Settings, LogOut, Monitor } from 'lucide-react';

export type AdminPanel = 'home' | 'conseils' | 'absences' | 'sorties' | 'evenements' | 'cantine' | 'diaporama' | 'bandeau' | 'settings';

interface NavItem {
  id: AdminPanel;
  label: string;
  icon: React.ReactNode;
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Tableau de bord', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'conseils', label: 'Conseils de classe', icon: <Calendar className="w-4 h-4" />, section: 'Contenu' },
  { id: 'absences', label: 'Absences', icon: <UserX className="w-4 h-4" /> },
  { id: 'sorties', label: 'Sorties scolaires', icon: <Bus className="w-4 h-4" /> },
  { id: 'evenements', label: 'Événements', icon: <PartyPopper className="w-4 h-4" /> },
  { id: 'cantine', label: 'Cantine', icon: <UtensilsCrossed className="w-4 h-4" /> },
  { id: 'diaporama', label: 'Diaporama', icon: <Image className="w-4 h-4" />, section: 'Affichage' },
  { id: 'bandeau', label: 'Bandeau défilant', icon: <Radio className="w-4 h-4" /> },
  { id: 'settings', label: 'Établissement', icon: <Settings className="w-4 h-4" />, section: 'Réglages' },
];

interface Props {
  activePanel: AdminPanel;
  onNavigate: (panel: AdminPanel) => void;
  onLogout: () => void;
  onDisplayMode: () => void;
}

export const AdminNav: React.FC<Props> = ({ activePanel, onNavigate, onLogout, onDisplayMode }) => {
  return (
    <div
      className="flex flex-col py-4 overflow-y-auto no-scrollbar flex-shrink-0"
      style={{ background: '#0c0e1a', borderRight: '1px solid rgba(232,184,75,0.08)', width: 220 }}
    >
      {NAV_ITEMS.map(item => (
        <React.Fragment key={item.id}>
          {item.section && (
            <p className="px-5 pt-4 pb-2 text-[10px] font-black uppercase tracking-widest text-white/25">
              {item.section}
            </p>
          )}
          <button
            onClick={() => onNavigate(item.id)}
            className="mx-3 px-3 py-2.5 rounded-xl flex items-center gap-2.5 text-sm font-medium transition-all text-left"
            style={
              activePanel === item.id
                ? { background: 'rgba(232,184,75,0.12)', color: '#e8b84b', border: '1px solid rgba(232,184,75,0.2)' }
                : { color: 'rgba(241,245,249,0.5)', border: '1px solid transparent' }
            }
          >
            {item.icon}
            {item.label}
          </button>
        </React.Fragment>
      ))}

      <div className="mt-auto pt-4 px-3 space-y-1">
        <button
          onClick={onDisplayMode}
          className="w-full px-3 py-2.5 rounded-xl flex items-center gap-2.5 text-sm font-medium transition-all text-left"
          style={{ color: 'rgba(241,245,249,0.4)', border: '1px solid transparent' }}
        >
          <Monitor className="w-4 h-4" />
          Vue affichage
        </button>
        <button
          onClick={onLogout}
          className="w-full px-3 py-2.5 rounded-xl flex items-center gap-2.5 text-sm font-medium transition-all text-left"
          style={{ color: 'rgba(239,68,68,0.7)', border: '1px solid transparent' }}
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};
