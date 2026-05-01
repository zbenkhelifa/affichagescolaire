import React, { useState } from 'react';
import { Evenement } from '../../../types';
import { sb } from '../../../services/supabase';
import { Plus, Trash2 } from 'lucide-react';
import { PanelHeader } from './PanelHeader';
import { FormCard } from './FormCard';
import { Btn } from './Btn';
import { Field, Input } from './ConseilsPanel';

interface Props {
  evenements: Evenement[];
  onRefresh: () => void;
}

const EMPTY: Omit<Evenement, 'id'> = { titre: '', date: '', heure: '', lieu: '', desc: '' };

export const EvenementsPanel: React.FC<Props> = ({ evenements, onRefresh }) => {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const save = async () => {
    if (!form.titre || !form.date) return;
    setSaving(true);
    try {
      await sb.insert('evenements', {
        titre: form.titre, date: form.date, heure: form.heure || null,
        lieu: form.lieu || null, description: form.desc || null,
      });
      setForm(EMPTY);
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    setDeleting(id);
    try { await sb.delete('evenements', { id }); onRefresh(); }
    finally { setDeleting(null); }
  };

  return (
    <div>
      <PanelHeader title="🎉 Événements" subtitle="Gérer les événements et manifestations" onBack={() => {}} />

      <FormCard title="Ajouter un événement">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Titre *">
            <Input placeholder="ex: Journée portes ouvertes" value={form.titre} onChange={v => setForm(f => ({ ...f, titre: v }))} />
          </Field>
          <Field label="Date *">
            <Input type="date" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} />
          </Field>
          <Field label="Heure">
            <Input type="time" value={form.heure} onChange={v => setForm(f => ({ ...f, heure: v }))} />
          </Field>
          <Field label="Lieu">
            <Input placeholder="ex: Gymnase" value={form.lieu} onChange={v => setForm(f => ({ ...f, lieu: v }))} />
          </Field>
          <div className="col-span-2">
            <Field label="Description">
              <Input placeholder="Détails de l'événement…" value={form.desc} onChange={v => setForm(f => ({ ...f, desc: v }))} rows={3} />
            </Field>
          </div>
        </div>
        <div className="mt-4">
          <Btn onClick={save} loading={saving} disabled={!form.titre || !form.date} icon={<Plus className="w-4 h-4" />}>
            Ajouter
          </Btn>
        </div>
      </FormCard>

      <FormCard title={`Liste (${evenements.length})`}>
        {evenements.length === 0 ? (
          <p className="text-white/30 text-sm">Aucun événement enregistré</p>
        ) : (
          <div className="space-y-2">
            {evenements.map(e => (
              <div key={e.id} className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.12)' }}>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-sm">{e.titre}</div>
                  <div className="text-white/50 text-xs mt-0.5">{e.date} {e.heure && `à ${e.heure}`} {e.lieu && `· ${e.lieu}`}</div>
                </div>
                <button onClick={() => del(e.id)} disabled={deleting === e.id} className="p-1.5 rounded-lg text-accent2/60 hover:text-accent2 hover:bg-accent2/10 transition-colors flex-shrink-0">
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
