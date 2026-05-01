import React, { useEffect, useState } from 'react';
import { AppData } from '../types';
import { Topbar } from '../components/Topbar';
import { Slideshow } from '../components/Slideshow';
import { InfoPanel } from '../components/InfoPanel';
import { Ticker } from '../components/Ticker';

interface Props {
  data: AppData;
  isLoading: boolean;
  onAdminClick?: () => void;
  onExit?: () => void;
}

export const DisplayMode: React.FC<Props> = ({ data, isLoading, onAdminClick, onExit }) => {
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    const check = () => setIsPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!onExit) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onExit(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onExit]);

  return (
    <div className="display-root w-full h-full flex flex-col relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 20% 20%, var(--bg-grad-1) 0%, var(--bg-grad-2) 60%), radial-gradient(ellipse at 80% 80%, var(--bg-grad-3) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(232,184,75,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,184,75,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <Topbar school={data.school} onAdminClick={onAdminClick} onExit={onExit} />

      {isPortrait ? (
        <div className="relative z-5 flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 relative overflow-hidden min-h-0">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white/10 border-t-accent rounded-full animate-spin" />
              </div>
            ) : (
              <Slideshow slides={data.slides} />
            )}
          </div>
          <div style={{ height: 'clamp(150px, 30%, 280px)', flexShrink: 0 }}>
            <InfoPanel data={data} compact />
          </div>
        </div>
      ) : (
        <div className="relative z-5 flex-1 grid min-h-0 overflow-hidden" style={{ gridTemplateColumns: '1fr 500px' }}>
          <div className="relative overflow-hidden">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white/10 border-t-accent rounded-full animate-spin" />
              </div>
            ) : (
              <Slideshow slides={data.slides} />
            )}
          </div>
          <InfoPanel data={data} />
        </div>
      )}

      <Ticker items={data.ticker} config={data.config} />
    </div>
  );
};
