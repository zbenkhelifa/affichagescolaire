import React from 'react';

interface Props {
  title: string;
  subtitle?: string;
  onBack: () => void;
}

export const PanelHeader: React.FC<Props> = ({ title, subtitle }) => (
  <div className="flex items-start justify-between mb-6">
    <div>
      <h2 className="font-syne text-xl font-black text-white">{title}</h2>
      {subtitle && <p className="text-white/40 text-sm mt-1">{subtitle}</p>}
    </div>
  </div>
);
