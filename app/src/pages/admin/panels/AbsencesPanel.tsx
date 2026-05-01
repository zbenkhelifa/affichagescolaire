import React, { useState } from 'react';
import { Absence } from '../../../types';
import { sb } from '../../../services/supabase';
import { Plus, Trash2 } from 'lucide-react';
import { PanelHeader } from './PanelHeader';
import { FormCard } from './FormCard';
import { Btn } from './Btn';
import { Field, Input, Select } from './ConseilsPanel';

interface Props {
  absences: Absence[];
  onRefresh: () => void;
}

const EMPTY: Omit<Absence, 'id'> = { nom: '', matiere: '', date: '', classes: '', remplacement: 'non' };

export const AbsencesPanel: React.FC<Props> = ({ absences, onRefresh }) => {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const save = async () => {
    if (!form.nom || !form.date) return;
    setSaving(true);
    try {
      await sb.insert('absences', {
        nom: form.nom, matiere: form.matiere || null, date: form.date,
        classes: form.classes || null, remplacement: form.remplacement,
      });
      setForm(EMPTY);
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    setDeleting(id);
    try { await sb.delete('absences', { id }); onRefresh(); }
    finally { setDeleting(null); }
  };

  return (
    <div>
      <PanelHeader title="📌 Absences professeurs" subtitle="Gérer les absences et remplacements" onBack={() => {}} />

      <FormCard title="Déclarer une absence">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Professeur *">
            <Input placeholder="ex: M. Dupont" value={form.nom} onChange={v => setForm(f => ({ ...f, nom: v }))} />
          </Field>
          <Field label="Matière">
            <Input placeholder="ex: Mathématiques" value={form.matiere} onChange={v => setForm(f => ({ ...f, matiere: v }))} />
          </Field>
          <Field label="Date *">
            <Input type="date" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} />
          </Field>
          <Field label="Classes concernées">
            <Input placeholder="ex: 5ème B, 4ème A" value={form.classes} onChange={v => setForm(f => ({ ...f, classes: v }))} />
          </Field>
          <Field label="Remplacement">
            <Select value={form.remplacement} onChange={v => setForm(f => ({ ...f, remplacement: v }))}>
              <option value="non">Non remplacé</option>
              <option value="oui">Remplacé</option>
              <option value="partiel">Partiellement remplacé</option>
            </Select>
          </Field>
        </div>
        <div className="mt-4">
          <Btn onClick={save} loading={saving} disabled={!form.nom || !form.date} icon={<Plus className="w-4 h-4" />}>
            Ajouter
          </Btn>
        </div>
      </FormCard>

      <FormCard title={`Liste (${absences.length})`}>
        {absences.length === 0 ? (
          <p className="text-white/30 text-sm">Aucune absence enregistrée</p>
        ) : (
          <div className="space-y-2">
            {absences.map(a => (
              <div key={a.id} className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-sm">{a.nom} <span className="text-white/40 font-normal">— {a.matiere}</span></div>
                  <div className="text-white/50 text-xs mt-0.5">{a.date} · {a.classes}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: a.remplacement === 'oui' ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.06)', color: a.remplacement === 'oui' ? '#4ade80' : 'rgba(241,245,249,0.4)' }}>
                    {a.remplacement}
                  </span>
                  <button onClick={() => del(a.id)} disabled={deleting === a.id} className="p-1.5 rounded-lg text-accent2/60 hover:text-accent2 hover:bg-accent2/10 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </FormCard>
    </div>
  );
};
