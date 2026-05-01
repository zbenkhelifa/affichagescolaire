import React, { useState } from 'react';
import { Cantine } from '../../../types';
import { sb } from '../../../services/supabase';
import { Plus, Trash2 } from 'lucide-react';
import { PanelHeader } from './PanelHeader';
import { FormCard } from './FormCard';
import { Btn } from './Btn';
import { Field, Input } from './ConseilsPanel';

interface Props {
  cantine: Cantine[];
  onRefresh: () => void;
}

const EMPTY: Omit<Cantine, 'id'> = { date: '', entree: '', plat: '', accomp: '', fromage: '', dessert: '' };

export const CantinePanel: React.FC<Props> = ({ cantine, onRefresh }) => {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const save = async () => {
    if (!form.date) return;
    setSaving(true);
    try {
      await sb.insert('cantine', {
        date: form.date, entree: form.entree || null, plat: form.plat || null,
        accompagnement: form.accomp || null, fromage: form.fromage || null, dessert: form.dessert || null,
      });
      setForm(EMPTY);
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    setDeleting(id);
    try { await sb.delete('cantine', { id }); onRefresh(); }
    finally { setDeleting(null); }
  };

  return (
    <div>
      <PanelHeader title="🍽 Menu cantine" subtitle="Gérer les menus de la semaine" onBack={() => {}} />

      <FormCard title="Ajouter un menu">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Date *">
            <Input type="date" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} />
          </Field>
          <Field label="Entrée">
            <Input placeholder="ex: Salade de tomates" value={form.entree} onChange={v => setForm(f => ({ ...f, entree: v }))} />
          </Field>
          <Field label="Plat principal">
            <Input placeholder="ex: Poulet rôti, haricots verts" value={form.plat} onChange={v => setForm(f => ({ ...f, plat: v }))} />
          </Field>
          <Field label="Accompagnement">
            <Input placeholder="ex: Riz, pâtes…" value={form.accomp} onChange={v => setForm(f => ({ ...f, accomp: v }))} />
          </Field>
          <Field label="Fromage">
            <Input placeholder="ex: Yaourt nature" value={form.fromage} onChange={v => setForm(f => ({ ...f, fromage: v }))} />
          </Field>
          <Field label="Dessert">
            <Input placeholder="ex: Tarte aux pommes" value={form.dessert} onChange={v => setForm(f => ({ ...f, dessert: v }))} />
          </Field>
        </div>
        <div className="mt-4">
          <Btn onClick={save} loading={saving} disabled={!form.date} icon={<Plus className="w-4 h-4" />}>
            Ajouter
          </Btn>
        </div>
      </FormCard>

      <FormCard title={`Menus enregistrés (${cantine.length})`}>
        {cantine.length === 0 ? (
          <p className="text-white/30 text-sm">Aucun menu enregistré</p>
        ) : (
          <div className="space-y-2">
            {cantine.map(c => (
              <div key={c.id} className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.1)' }}>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-sm">{c.date}</div>
                  <div className="text-white/50 text-xs mt-0.5 truncate">
                    {[c.entree, c.plat, c.dessert].filter(Boolean).join(' · ')}
                  </div>
                </div>
                <button onClick={() => del(c.id)} disabled={deleting === c.id} className="p-1.5 rounded-lg text-accent2/60 hover:text-accent2 hover:bg-accent2/10 transition-colors flex-shrink-0">
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
