import React, { useState, useRef } from 'react';
import { Slide } from '../../../types';
import { sb } from '../../../services/supabase';
import { Plus, Trash2, Upload } from 'lucide-react';
import { PanelHeader } from './PanelHeader';
import { FormCard } from './FormCard';
import { Btn } from './Btn';
import { Field, Input, Select } from './ConseilsPanel';

const COLORS = [
  { label: 'Bleu marine', value: 'linear-gradient(135deg, #1a3a6b, #0a1628)' },
  { label: 'Violet nuit', value: 'linear-gradient(135deg, #0a1628, #0d0a1e)' },
  { label: 'Vert forêt', value: 'linear-gradient(135deg, #1a5c3a, #0a2818)' },
  { label: 'Rouge bordeaux', value: 'linear-gradient(135deg, #5c1a1a, #200a0a)' },
  { label: 'Or profond', value: 'linear-gradient(135deg, #1a3a6b, #1a1000)' },
];

interface Props {
  slides: Slide[];
  onRefresh: () => void;
}

const EMPTY = { title: '', sub: '', img: '', color: COLORS[0].value, emoji: '' };

export const DiaporamaPanel: React.FC<Props> = ({ slides, onRefresh }) => {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => setForm(f => ({ ...f, img: e.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const save = async () => {
    setSaving(true);
    try {
      await sb.insert('slides', {
        titre: form.title, sous_titre: form.sub || null,
        image_data: form.img || null, couleur: form.color,
        emoji: form.emoji || null, ordre: slides.length,
      });
      setForm(EMPTY);
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    setDeleting(id);
    try { await sb.delete('slides', { id }); onRefresh(); }
    finally { setDeleting(null); }
  };

  return (
    <div>
      <PanelHeader title="🖼 Diaporama" subtitle="Gérer les diapositives affichées à l'écran" onBack={() => {}} />

      <FormCard title="Ajouter une diapositive">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Titre">
            <Input placeholder="ex: Bienvenue au collège" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} />
          </Field>
          <Field label="Sous-titre">
            <Input placeholder="ex: Année scolaire 2024-2025" value={form.sub} onChange={v => setForm(f => ({ ...f, sub: v }))} />
          </Field>
        </div>

        {/* Drop zone */}
        <div className="mt-4">
          <label className="block text-[11px] font-black uppercase tracking-widest text-white/40 mb-2">
            Image (optionnelle)
          </label>
          <div
            className="rounded-xl p-6 text-center cursor-pointer transition-all"
            style={{
              border: `2px dashed ${dragOver ? 'rgba(232,184,75,0.6)' : 'rgba(232,184,75,0.2)'}`,
              background: 'rgba(255,255,255,0.02)',
            }}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
          >
            {form.img ? (
              <div className="relative inline-block">
                <img src={form.img} alt="Aperçu" className="max-h-36 max-w-full rounded-lg object-cover" />
                <button
                  onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, img: '' })); }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent2 text-white text-xs flex items-center justify-center"
                >×</button>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <p className="text-white/50 text-sm">Cliquez ou glissez une image</p>
                <p className="text-white/25 text-xs mt-1">JPG, PNG, WebP</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <Field label="Couleur de fond">
            <Select value={form.color} onChange={v => setForm(f => ({ ...f, color: v }))}>
              {COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </Select>
          </Field>
          <Field label="Emoji (si sans image)">
            <Input placeholder="🏫" value={form.emoji} onChange={v => setForm(f => ({ ...f, emoji: v }))} />
          </Field>
        </div>

        <div className="mt-4">
          <Btn onClick={save} loading={saving} icon={<Plus className="w-4 h-4" />}>
            Ajouter la diapositive
          </Btn>
        </div>
      </FormCard>

      <FormCard title={`Diapositives (${slides.length})`}>
        {slides.length === 0 ? (
          <p className="text-white/30 text-sm">Aucune diapositive</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {slides.map(s => (
              <div key={s.id} className="relative rounded-xl overflow-hidden aspect-video"
                style={{ background: s.color || 'linear-gradient(135deg, #1a3a6b, #0a1628)' }}>
                {s.img && <img src={s.img} alt={s.title} className="w-full h-full object-cover" />}
                {s.emoji && !s.img && <div className="absolute inset-0 flex items-center justify-center text-5xl">{s.emoji}</div>}
                {s.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-2">
                    <p className="font-bold text-white text-xs truncate">{s.title}</p>
                  </div>
                )}
                <button
                  onClick={() => del(s.id)}
                  disabled={deleting === s.id}
                  className="absolute top-2 right-2 p-1 rounded-lg bg-black/60 text-white/70 hover:text-white hover:bg-black/80 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </FormCard>
    </div>
  );
};
