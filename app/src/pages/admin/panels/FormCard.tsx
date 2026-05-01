import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
}

export const FormCard: React.FC<Props> = ({ title, children }) => (
  <div
    className="rounded-2xl p-5 mb-5"
    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(232,184,75,0.08)' }}
  >
    <h3 className="font-syne text-sm font-black text-accent uppercase tracking-widest mb-4">{title}</h3>
    {children}
  </div>
);
