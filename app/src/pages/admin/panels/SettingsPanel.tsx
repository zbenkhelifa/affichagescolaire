import React, { useState, useRef, useEffect } from 'react';
import { School, AppConfig } from '../../../types';
import { sb } from '../../../services/supabase';
import { Save, Upload, Copy, Check } from 'lucide-react';
import { PanelHeader } from './PanelHeader';
import { FormCard } from './FormCard';
import { Btn } from './Btn';
import { Field, Input } from './ConseilsPanel';

interface Props {
  school: School;
  config: AppConfig;
  onRefresh: () => void;
}

const SECTIONS = [
  { key: 'absences',   label: 'Absences professeurs' },
  { key: 'conseils',   label: 'Conseils de classe' },
  { key: 'sorties',    label: 'Sorties scolaires' },
  { key: 'evenements', label: 'Événements' },
  { key: 'cantine',    label: 'Menu cantine' },
  { key: 'ticker',     label: 'Bandeau défilant' },
];

const FONT_SIZES = [
  { value: '0.85', label: 'S' },
  { value: '1',    label: 'M' },
  { value: '1.1',  label: 'L' },
  { value: '1.4',  label: 'XL' },
];

const SPEEDS = [
  { value: '0.4', label: '🐢' },
  { value: '1',   label: '▶' },
  { value: '2',   label: '⏩' },
  { value: '3.5', label: '🚀' },
];


export const SettingsPanel: React.FC<Props> = ({ school, config, onRefresh }) => {
  const [form, setForm] = useState({
    name: school.name, subtitle: school.subtitle, logo: school.logo,
    adresse: school.adresse, telephone: school.telephone, email: school.email,
    site: school.site, academie: school.academie, uai: school.uai, message: school.message,
  });
  const [saving, setSaving] = useState(false);
  const [localConfig, setLocalConfig] = useState<AppConfig>(config);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const copyCode = () => {
    navigator.clipboard.writeText(school.displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    setForm({
      name: school.name, subtitle: school.subtitle, logo: school.logo,
      adresse: school.adresse, telephone: school.telephone, email: school.email,
      site: school.site, academie: school.academie, uai: school.uai, message: school.message,
    });
  }, [school]);

  useEffect(() => { setLocalConfig(config); }, [config]);

  const loadLogo = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => setForm(f => ({ ...f, logo: e.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const saveConfig = async (key: string, value: string) => {
    setLocalConfig(c => ({ ...c, [key]: value }));
    await sb.upsert('affichage_config', { cle: key, valeur: value } as any);
    onRefresh();
  };

  const save = async () => {
    setSaving(true);
    try {
      const body = {
        name: form.name, subtitle: form.subtitle, logo: form.logo,
        adresse: form.adresse || null, telephone: form.telephone || null,
        email: form.email || null, site: form.site || null,
        academie: form.academie || null, uai: form.uai || null, message: form.message || null,
      };
      if (school.id) {
        await sb.update('school_settings', { id: school.id }, body);
      } else {
        await sb.insert('school_settings', body);
      }
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const isEmoji = form.logo.length <= 4 && !/^(https?:|data:)/.test(form.logo);
  const fsBtn = (section: string, v: string) =>
    `px-3 py-1 rounded-lg text-xs font-bold transition-all ${
      (localConfig['font_size_' + section] || '1.1') === v
        ? 'text-navy'
        : 'text-white/40 hover:text-white/70'
    }`;

  const speedBtn = (v: string) =>
    `px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
      (localConfig['ticker_speed'] || '1') === v
        ? 'text-navy'
        : 'text-white/40 hover:text-white/70'
    }`;

  return (
    <div>
      <PanelHeader title="🏫 Établissement" subtitle="Identité, logo et informations de l'établissement" onBack={() => {}} />

      {/* Display code */}
      {school.displayCode && (
        <FormCard title="🔑 Code d'affichage élèves">
          <p className="text-white/50 text-xs mb-3">
            Donnez ce code aux élèves pour qu'ils accèdent à l'affichage en lecture seule, sans accès admin.
          </p>
          <div className="flex items-center gap-3">
            <div
              className="flex-1 px-5 py-3 rounded-xl text-center font-mono text-2xl font-black tracking-[0.3em] select-all"
              style={{ background: 'rgba(74,222,128,0.08)', border: '2px solid rgba(74,222,128,0.25)', color: '#4ade80' }}
            >
              {school.displayCode}
            </div>
            <button
              onClick={copyCode}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all"
              style={{ background: copied ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: copied ? '#4ade80' : 'rgba(241,245,249,0.6)' }}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copié !' : 'Copier'}
            </button>
          </div>
        </FormCard>
      )}

      {/* Preview */}
      <FormCard title="Aperçu de l'en-tête">
        <div className="flex items-center gap-4 rounded-xl px-5 py-4 mt-2" style={{ background: 'linear-gradient(135deg, rgba(26,58,107,0.9), rgba(9,9,11,0.95))', border: '1px solid rgba(232,184,75,0.2)' }}>
          <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: 'linear-gradient(135deg, #e8b84b, #d4a030)', fontSize: '1.8rem' }}>
            {isEmoji ? form.logo : <img src={form.logo} alt="Logo" className="w-full h-full object-cover" />}
          </div>
          <div>
            <div className="font-syne text-base font-black text-white">{form.name || 'Nom établissement'}</div>
            <div className="text-accent text-xs uppercase tracking-widest mt-0.5">{form.subtitle}</div>
          </div>
        </div>
      </FormCard>

      {/* Identity */}
      <FormCard title="🏷 Identité">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nom de l'établissement">
            <Input placeholder="ex: Collège Jean Moulin" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
          </Field>
          <Field label="Sous-titre">
            <Input placeholder="ex: Établissement public — Éducation Nationale" value={form.subtitle} onChange={v => setForm(f => ({ ...f, subtitle: v }))} />
          </Field>
        </div>
      </FormCard>

      {/* Logo */}
      <FormCard title="🖼 Logo">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: 'linear-gradient(135deg, #e8b84b, #d4a030)', fontSize: '2.4rem', boxShadow: '0 4px 20px rgba(232,184,75,0.3)' }}>
            {isEmoji ? form.logo : <img src={form.logo} alt="Logo" className="w-full h-full object-cover" />}
          </div>
          <div className="flex-1 min-w-56 space-y-3">
            <button onClick={() => fileRef.current?.click()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all" style={{ border: '2px dashed rgba(232,184,75,0.3)', background: 'rgba(255,255,255,0.02)', color: 'rgba(241,245,249,0.7)' }}>
              <Upload className="w-5 h-5" /><span>Cliquez pour téléverser une image</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && loadLogo(e.target.files[0])} />
            <div className="flex items-center gap-2">
              <span className="text-white/30 text-xs whitespace-nowrap">Ou emoji :</span>
              <input type="text" maxLength={4} value={isEmoji ? form.logo : ''} onChange={e => setForm(f => ({ ...f, logo: e.target.value }))} placeholder="🏫" className="w-20 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent/40 text-sm text-center" />
              <button onClick={() => setForm(f => ({ ...f, logo: '🏫' }))} className="text-xs text-white/30 hover:text-white/60 transition-colors">Réinitialiser</button>
            </div>
          </div>
        </div>
      </FormCard>

      {/* Contact */}
      <FormCard title="📋 Informations">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Adresse', key: 'adresse', placeholder: '12 rue Victor Hugo' },
            { label: 'Téléphone', key: 'telephone', placeholder: '01 23 45 67 89' },
            { label: 'Email', key: 'email', placeholder: 'contact@college.fr' },
            { label: 'Site web', key: 'site', placeholder: 'www.college.fr' },
            { label: 'Académie', key: 'academie', placeholder: 'Paris' },
            { label: 'Numéro UAI', key: 'uai', placeholder: '0750001A' },
          ].map(({ label, key, placeholder }) => (
            <Field key={key} label={label}>
              <Input placeholder={placeholder} value={(form as any)[key] || ''} onChange={v => setForm(f => ({ ...f, [key]: v }))} />
            </Field>
          ))}
        </div>
      </FormCard>


      {/* Font sizes */}
      <FormCard title="🔤 Taille du texte par section">
        <div className="space-y-2">
          {SECTIONS.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between py-1.5">
              <span className="text-white/60 text-sm">{label}</span>
              <div className="flex gap-1 rounded-lg p-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
                {FONT_SIZES.map(({ value, label: lbl }) => (
                  <button
                    key={value}
                    onClick={() => saveConfig('font_size_' + key, value)}
                    className={fsBtn(key, value)}
                    style={(localConfig['font_size_' + key] || '1.1') === value
                      ? { background: 'linear-gradient(135deg,#e8b84b,#d4a030)' }
                      : { background: 'transparent' }}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Ticker speed */}
          <div className="flex items-center justify-between py-1.5 pt-3 mt-1 border-t border-white/5">
            <span className="text-white/60 text-sm">Vitesse du bandeau</span>
            <div className="flex gap-1 rounded-lg p-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
              {SPEEDS.map(({ value, label: lbl }) => (
                <button
                  key={value}
                  onClick={() => saveConfig('ticker_speed', value)}
                  className={speedBtn(value)}
                  style={(localConfig['ticker_speed'] || '1') === value
                    ? { background: 'linear-gradient(135deg,#e8b84b,#d4a030)' }
                    : { background: 'transparent' }}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </FormCard>

      <div className="flex justify-end mt-2">
        <Btn onClick={save} loading={saving} icon={<Save className="w-4 h-4" />}>
          Enregistrer les modifications
        </Btn>
      </div>
    </div>
  );
};
