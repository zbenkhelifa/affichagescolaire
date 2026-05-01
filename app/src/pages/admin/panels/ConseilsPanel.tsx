import React, { useState } from 'react';
import { Conseil } from '../../../types';
import { sb } from '../../../services/supabase';
import { Plus, Trash2, Save } from 'lucide-react';
import { PanelHeader } from './PanelHeader';
import { FormCard } from './FormCard';
import { Btn } from './Btn';

interface Props {
  conseils: Conseil[];
  onRefresh: () => void;
}

const EMPTY: Omit<Conseil, 'id'> = { classe: '', date: '', heure: '17:00', salle: '', trim: 'T1' };

export const ConseilsPanel: React.FC<Props> = ({ conseils, onRefresh }) => {
  const [form, setForm] = useState<Omit<Conseil, 'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const save = async () => {
    if (!form.classe || !form.date) return;
    setSaving(true);
    try {
      await sb.insert('conseils', {
        classe: form.classe, date: form.date, heure: form.heure || null,
        salle: form.salle || null, trimestre: form.trim,
      });
      setForm(EMPTY);
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    setDeleting(id);
    try {
      await sb.delete('conseils', { id });
      onRefresh();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <PanelHeader title="📋 Conseils de classe" subtitle="Planifier les conseils de classe" onBack={() => {}} />

      <FormCard title="Ajouter un conseil">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Classe *">
            <Input placeholder="ex: 6ème A" value={form.classe} onChange={v => setForm(f => ({ ...f, classe: v }))} />
          </Field>
          <Field label="Date *">
            <Input type="date" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} />
          </Field>
          <Field label="Heure">
            <Input type="time" value={form.heure} onChange={v => setForm(f => ({ ...f, heure: v }))} />
          </Field>
          <Field label="Salle">
            <Input placeholder="ex: Salle des profs" value={form.salle} onChange={v => setForm(f => ({ ...f, salle: v }))} />
          </Field>
          <Field label="Trimestre">
            <Select value={form.trim} onChange={v => setForm(f => ({ ...f, trim: v }))}>
              <option value="T1">1er Trimestre</option>
              <option value="T2">2ème Trimestre</option>
              <option value="T3">3ème Trimestre</option>
            </Select>
          </Field>
        </div>
        <div className="mt-4">
          <Btn onClick={save} loading={saving} disabled={!form.classe || !form.date} icon={<Plus className="w-4 h-4" />}>
            Ajouter
          </Btn>
        </div>
      </FormCard>

      <FormCard title={`Liste (${conseils.length})`}>
        {conseils.length === 0 ? (
          <p className="text-white/30 text-sm">Aucun conseil enregistré</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <Th>Classe</Th><Th>Date</Th><Th>Heure</Th><Th>Salle</Th><Th>Trim.</Th><Th />
                </tr>
              </thead>
              <tbody>
                {conseils.map(c => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/3">
                    <Td className="font-bold text-white">{c.classe}</Td>
                    <Td>{c.date}</Td>
                    <Td>{c.heure}</Td>
                    <Td>{c.salle}</Td>
                    <Td>{c.trim}</Td>
                    <td className="py-2 px-3">
                      <button onClick={() => del(c.id)} disabled={deleting === c.id} className="p-1.5 rounded-lg text-accent2/60 hover:text-accent2 hover:bg-accent2/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </FormCard>
    </div>
  );
};

// ── Shared sub-components ──────────────────────────────────────

export const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-[11px] font-black uppercase tracking-widest text-white/40 mb-1.5">{label}</label>
    {children}
  </div>
);

export const Input: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  rows?: number;
}> = ({ value, onChange, placeholder, type = 'text', rows }) => {
  const cls = "w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-accent/40 transition-colors text-sm";
  if (rows) {
    return <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />;
  }
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />;
};

export const Select: React.FC<{ value: string; onChange: (v: string) => void; children: React.ReactNode }> = ({ value, onChange, children }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent/40 transition-colors text-sm"
  >
    {children}
  </select>
);

const Th: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <th className="py-2 px-3 text-white/40 font-semibold text-xs uppercase tracking-wider">{children}</th>
);

const Td: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = 'text-white/70' }) => (
  <td className={`py-2.5 px-3 ${className}`}>{children}</td>
);
