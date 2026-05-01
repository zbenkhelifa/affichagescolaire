import React from 'react';

interface Props {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'primary' | 'danger' | 'outline' | 'green';
  size?: 'sm' | 'md';
}

const VARIANTS = {
  primary: { background: 'linear-gradient(135deg, #e8b84b, #d4a030)', color: '#0a1628' },
  danger: { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' },
  outline: { background: 'transparent', border: '1px solid rgba(241,245,249,0.2)', color: 'rgba(241,245,249,0.7)' },
  green: { background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80' },
};

export const Btn: React.FC<Props> = ({ onClick, loading, disabled, children, icon, variant = 'primary', size = 'md' }) => {
  const style = VARIANTS[variant];
  const pad = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-2 rounded-xl font-syne font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${pad}`}
      style={style as React.CSSProperties}
    >
      {loading ? (
        <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      ) : icon}
      {children}
    </button>
  );
};
