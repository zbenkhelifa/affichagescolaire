export interface School {
  id: string | null;
  name: string;
  subtitle: string;
  logo: string;
  adresse: string;
  telephone: string;
  email: string;
  site: string;
  academie: string;
  uai: string;
  message: string;
  displayCode: string;
}

export interface Conseil {
  id: string;
  classe: string;
  date: string;
  heure: string;
  salle: string;
  trim: string;
}

export interface Absence {
  id: string;
  nom: string;
  matiere: string;
  date: string;
  classes: string;
  remplacement: string;
}

export interface Sortie {
  id: string;
  titre: string;
  date: string;
  classes: string;
  lieu: string;
  acc: string;
  heure: string;
}

export interface Evenement {
  id: string;
  titre: string;
  date: string;
  heure: string;
  lieu: string;
  desc: string;
}

export interface Cantine {
  id: string;
  date: string;
  entree: string;
  plat: string;
  accomp: string;
  fromage: string;
  dessert: string;
}

export interface Slide {
  id: string;
  title: string;
  sub: string;
  img: string;
  color: string;
  emoji: string;
}

export interface TickerItem {
  id: string;
  message: string;
}

export interface AppConfig {
  [key: string]: string;
}

export interface AppData {
  school: School;
  config: AppConfig;
  conseils: Conseil[];
  absences: Absence[];
  sorties: Sortie[];
  evenements: Evenement[];
  cantine: Cantine[];
  slides: Slide[];
  ticker: TickerItem[];
}
