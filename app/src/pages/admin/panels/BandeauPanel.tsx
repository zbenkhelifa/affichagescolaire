import React, { useState } from 'react';
import { TickerItem } from '../../../types';
import { sb } from '../../../services/supabase';
import { Plus, Trash2 } from 'lucide-react';
import { PanelHeader } from './PanelHeader';
import { FormCard } from './FormCard';
import { Btn } from './Btn';
import { Field, Input } from './ConseilsPanel';

interface Props {
  ticker: TickerItem[];
  onRefresh: () => void;
}

export const BandeauPanel: React.FC<Props> = ({ ticker, onRefresh }) => {
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const save = async () => {
    if (!message.trim()) return;
    setSaving(true);
    try {
      await sb.insert('ticker_messages', { message: message.trim(), ordre: ticker.length });
      setMessage('');
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    setDeleting(id);
    try { await sb.delete('ticker_messages', { id }); onRefresh(); }
    finally { setDeleting(null); }
  };

  return (
    <div>
      <PanelHeader title="📡 Bandeau défilant" subtitle="Messages affichés en bas de l'écran" onBack={() => {}} />

      <FormCard title="Ajouter un message">
        <Field label="Message *">
          <Input
            placeholder="ex: Réunion parents-professeurs le 15 novembre à 18h"
            value={message}
            onChange={setMessage}
          />
        </Field>
        <div className="mt-4">
          <Btn onClick={save} loading={saving} disabled={!message.trim()} icon={<Plus className="w-4 h-4" />}>
            Ajouter
          </Btn>
        </div>
      </FormCard>

      <FormCard title={`Messages (${ticker.length})`}>
        {ticker.length === 0 ? (
          <p className="text-white/30 text-sm">Aucun message dans le bandeau</p>
        ) : (
          <div className="space-y-2">
            {ticker.map(t => (
              <div key={t.id} className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(232,184,75,0.05)', border: '1px solid rgba(232,184,75,0.12)' }}>
                <span className="flex-1 text-white/80 text-sm">{t.message}</span>
                <button onClick={() => del(t.id)} disabled={deleting === t.id} className="p-1.5 rounded-lg text-accent2/60 hover:text-accent2 hover:bg-accent2/10 transition-colors flex-shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </FormCard>
    </div>
  );
};
