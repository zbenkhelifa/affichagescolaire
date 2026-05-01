import React, { useMemo } from 'react';
import { TickerItem } from '../types';

interface Props {
  items: TickerItem[];
  config: Record<string, string>;
  compact?: boolean;
}

export const Ticker: React.FC<Props> = ({ items, config, compact = false }) => {
  const msgs = items.length > 0
    ? items.map(t => t.message)
    : ["Bienvenue sur le tableau d'affichage"];

  const fontSizeRem = compact ? 0.78 : parseFloat(config['font_size_ticker'] || '1.1');
  const speed       = parseFloat(config['ticker_speed'] || '1');

  const { doubled, duration } = useMemo(() => {
    const minReps = Math.max(2, Math.ceil(8 / msgs.length));
    const block   = Array.from({ length: minReps }, () => msgs).flat();
    const doubled = [...block, ...block];
    const totalChars = msgs.join(' ').length * minReps;
    const baseDuration = Math.max(15, totalChars * 0.22);
    return { doubled, duration: baseDuration / speed };
  }, [msgs.join('|'), speed]);

  return (
    <div
      className="relative z-10 flex items-center overflow-hidden flex-shrink-0"
      style={{ background: 'linear-gradient(135deg, #e8b84b 0%, #d4a030 100%)', height: compact ? 36 : 60 }}
    >
      {!compact && (
        <div
          className="px-7 h-full flex items-center flex-shrink-0 z-10"
          style={{ background: '#0a1628' }}
        >
          <span className="font-syne font-black uppercase tracking-widest text-accent whitespace-nowrap" style={{ fontSize: '0.95rem' }}>
            ★ Infos
          </span>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <div
          className="inline-flex whitespace-nowrap"
          style={{
            animation: `ticker-scroll ${duration}s linear infinite`,
            fontSize: `${fontSizeRem}rem`,
            willChange: 'transform',
          }}
          onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
          onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
        >
          {doubled.map((msg, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-10 font-bold" style={{ color: '#0a1628' }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'rgba(9,9,11,0.4)' }} />
              {msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
