import React, { useState } from 'react';
import { Sortie } from '../../../types';
import { sb } from '../../../services/supabase';
import { Plus, Trash2 } from 'lucide-react';
import { PanelHeader } from './PanelHeader';
import { FormCard } from './FormCard';
import { Btn } from './Btn';
import { Field, Input } from './ConseilsPanel';

interface Props {
  sorties: Sortie[];
  onRefresh: () => void;
}

const EMPTY: Omit<Sortie, 'id'> = { titre: '', date: '', classes: '', lieu: '', acc: '', heure: '' };

export const SortiesPanel: React.FC<Props> = ({ sorties, onRefresh }) => {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const save = async () => {
    if (!form.titre || !form.date) return;
    setSaving(true);
    try {
      await sb.insert('sorties', {
        titre: form.titre, date: form.date, classes: form.classes || null,
        lieu: form.lieu || null, accompagnateur: form.acc || null,
        heure_depart: form.heure || null,
      });
      setForm(EMPTY);
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    setDeleting(id);
    try { await sb.delete('sorties', { id }); onRefresh(); }
    finally { setDeleting(null); }
  };

  return (
    <div>
      <PanelHeader title="🚌 Sorties scolaires" subtitle="Planifier les sorties et voyages" onBack={() => {}} />

      <FormCard title="Ajouter une sortie">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Titre *">
            <Input placeholder="ex: Visite du Louvre" value={form.titre} onChange={v => setForm(f => ({ ...f, titre: v }))} />
          </Field>
          <Field label="Date *">
            <Input type="date" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} />
          </Field>
          <Field label="Classes">
            <Input placeholder="ex: 3ème A et B" value={form.classes} onChange={v => setForm(f => ({ ...f, classes: v }))} />
          </Field>
          <Field label="Lieu">
            <Input placeholder="ex: Paris — Musée du Louvre" value={form.lieu} onChange={v => setForm(f => ({ ...f, lieu: v }))} />
          </Field>
          <Field label="Accompagnateur">
            <Input placeholder="ex: Mme Martin" value={form.acc} onChange={v => setForm(f => ({ ...f, acc: v }))} />
          </Field>
          <Field label="Heure de départ">
            <Input type="time" value={form.heure} onChange={v => setForm(f => ({ ...f, heure: v }))} />
          </Field>
        </div>
        <div className="mt-4">
          <Btn onClick={save} loading={saving} disabled={!form.titre || !form.date} icon={<Plus className="w-4 h-4" />}>
            Ajouter
          </Btn>
        </div>
      </FormCard>

      <FormCard title={`Liste (${sorties.length})`}>
        {sorties.length === 0 ? (
          <p className="text-white/30 text-sm">Aucune sortie enregistrée</p>
        ) : (
          <div className="space-y-2">
            {sorties.map(s => (
              <div key={s.id} className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.1)' }}>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-sm">{s.titre}</div>
                  <div className="text-white/50 text-xs mt-0.5">{s.date} · {s.classes} {s.lieu && `· ${s.lieu}`}</div>
                </div>
                <button onClick={() => del(s.id)} disabled={deleting === s.id} className="p-1.5 rounded-lg text-accent2/60 hover:text-accent2 hover:bg-accent2/10 transition-colors flex-shrink-0">
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
