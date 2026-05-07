import React from 'react';

export const Splashscreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-navy overflow-hidden">
      {/* Background radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 20% 20%, #0a1628 0%, #0a1628 60%), radial-gradient(ellipse at 80% 80%, #1a3a6b 0%, transparent 60%)',
        }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(232,184,75,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,184,75,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-5 animate-fade-slide-in">
        <div
          className="w-16 h-16 rounded-2xl overflow-hidden shadow-2xl"
          style={{ boxShadow: '0 8px 40px rgba(232,184,75,0.4)' }}
        >
          <img src="./icon.png" alt="AffichageScolaire" className="w-full h-full object-cover" />
        </div>

        <div className="text-center w-full px-6">
          <h1 className="font-syne font-black text-white tracking-tight uppercase leading-none mb-1" style={{ fontSize: 'clamp(1rem, 6vw, 1.5rem)' }}>
            Affichage<span className="text-gradient-gold">Scolaire</span>
          </h1>
          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="h-px w-8 bg-white/10" />
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Affichage numérique</p>
            <div className="h-px w-8 bg-white/10" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 mt-2">
          <div className="w-5 h-5 border-4 border-white/10 border-t-accent rounded-full animate-spin" />
          <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Chargement…</span>
        </div>
      </div>
    </div>
  );
};
