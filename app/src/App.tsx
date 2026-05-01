import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { AppData } from './types';
import { sb, setDisplayMode, clearSession } from './services/supabase';
import { auth, AuthUser } from './services/auth';
import { Splashscreen } from './components/Splashscreen';
import { AuthScreen } from './components/AuthScreen';
import { DisplayMode } from './pages/DisplayMode';
import { MobileDisplayMode } from './pages/MobileDisplayMode';
import { MobileAuthScreen } from './components/MobileAuthScreen';
import { AdminMode } from './pages/admin/AdminMode';

const IS_NATIVE = Capacitor.isNativePlatform();

const DEFAULT_DATA: AppData = {
  school: {
    id: null,
    name: 'Chargement…',
    subtitle: '',
    logo: '🏫',
    adresse: '',
    telephone: '',
    email: '',
    site: '',
    academie: '',
    uai: '',
    message: '',
    displayCode: '',
  },
  config: {},
  conseils: [],
  absences: [],
  sorties: [],
  evenements: [],
  cantine: [],
  slides: [],
  ticker: [],
};

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isDisplayCode, setIsDisplayCode] = useState(false);

  useEffect(() => {
    const splashTimer = setTimeout(() => setShowSplash(false), 1800);

    auth.getSession().then(session => {
      setUser(session);
      setAuthChecked(true);
    });

    const { data: listener } = auth.onAuthChange(updatedUser => {
      setUser(updatedUser);
      if (!updatedUser) {
        setIsAdmin(false);
        setIsDisplayCode(false);
        setData(DEFAULT_DATA);
      }
    });

    return () => {
      clearTimeout(splashTimer);
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) loadAllData();
  }, [user]);

  const handleDisplayCode = async (schoolId: string) => {
    setDisplayMode(schoolId);
    setIsDisplayCode(true);
    await loadAllData();
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [school, conseils, absences, sorties, evenements, cantine, slides, ticker, config] =
        await Promise.all([
          sb.select<any>('school_settings'),
          sb.select<any>('conseils', { order: 'date.asc' }),
          sb.select<any>('absences', { order: 'date.asc' }),
          sb.select<any>('sorties', { order: 'date.asc' }),
          sb.select<any>('evenements', { order: 'date.asc' }),
          sb.select<any>('cantine', { order: 'date.asc' }),
          sb.select<any>('slides', { order: 'ordre.asc' }),
          sb.select<any>('ticker_messages', { order: 'ordre.asc' }),
          sb.select<any>('affichage_config'),
        ]);

      let schoolRow = school[0];
      if (!schoolRow) {
        const created = await sb.insert<any>('school_settings', { name: '', subtitle: '', logo: '🏫' });
        schoolRow = created[0] || {};
      }
      const configMap: Record<string, string> = {};
      config.forEach((r: any) => { configMap[r.cle] = r.valeur; });

      setData({
        school: {
          id: schoolRow.id ?? null,
          name: schoolRow.name ?? '',
          subtitle: schoolRow.subtitle ?? '',
          logo: schoolRow.logo ?? '🏫',
          adresse: schoolRow.adresse ?? '',
          telephone: schoolRow.telephone ?? '',
          email: schoolRow.email ?? '',
          site: schoolRow.site ?? '',
          academie: schoolRow.academie ?? '',
          uai: schoolRow.uai ?? '',
          message: schoolRow.message ?? '',
          displayCode: schoolRow.display_code ?? '',
        },
        config: configMap,
        conseils: conseils.map((r: any) => ({
          id: r.id, classe: r.classe, date: r.date,
          heure: r.heure ? r.heure.slice(0, 5) : '', salle: r.salle || '', trim: r.trimestre,
        })),
        absences: absences.map((r: any) => ({
          id: r.id, nom: r.nom, matiere: r.matiere || '',
          date: r.date, classes: r.classes || '', remplacement: r.remplacement,
        })),
        sorties: sorties.map((r: any) => ({
          id: r.id, titre: r.titre, date: r.date, classes: r.classes || '',
          lieu: r.lieu || '', acc: r.accompagnateur || '',
          heure: r.heure_depart ? r.heure_depart.slice(0, 5) : '',
        })),
        evenements: evenements.map((r: any) => ({
          id: r.id, titre: r.titre, date: r.date,
          heure: r.heure ? r.heure.slice(0, 5) : '', lieu: r.lieu || '', desc: r.description || '',
        })),
        cantine: cantine.map((r: any) => ({
          id: r.id, date: r.date, entree: r.entree || '', plat: r.plat || '',
          accomp: r.accompagnement || '', fromage: r.fromage || '', dessert: r.dessert || '',
        })),
        slides: slides.map((r: any) => ({
          id: r.id, title: r.titre, sub: r.sous_titre || '',
          img: r.image_data || '', color: r.couleur, emoji: r.emoji,
        })),
        ticker: ticker.map((r: any) => ({ id: r.id, message: r.message })),
      });
    } catch (e) {
      console.error('Erreur chargement données:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    setIsAdmin(false);
  };

  const handleExitDisplayMode = () => {
    clearSession();
    setIsDisplayCode(false);
    setData(DEFAULT_DATA);
  };

  if (showSplash || !authChecked) return <Splashscreen />;

  if (!user && !isDisplayCode) {
    if (IS_NATIVE) return <MobileAuthScreen onDisplayCode={handleDisplayCode} />;
    return <AuthScreen onAuth={setUser} onDisplayCode={handleDisplayCode} />;
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-navy font-sans">
      {isAdmin ? (
        <AdminMode
          data={data}
          userEmail={user!.email}
          onDataChange={loadAllData}
          onLogout={handleLogout}
          onDisplayMode={() => setIsAdmin(false)}
        />
      ) : IS_NATIVE ? (
        <MobileDisplayMode
          data={data}
          isLoading={isLoading}
          onAdminClick={isDisplayCode ? undefined : () => setIsAdmin(true)}
          onExit={isDisplayCode ? handleExitDisplayMode : undefined}
        />
      ) : (
        <DisplayMode
          data={data}
          isLoading={isLoading}
          onAdminClick={isDisplayCode ? undefined : () => setIsAdmin(true)}
          onExit={isDisplayCode ? handleExitDisplayMode : undefined}
        />
      )}
    </div>
  );
}
