-- Migration : support multi-établissement
-- Ajoute school_id sur toutes les tables, active RLS, crée les policies

-- 1. Ajouter la colonne school_id (= auth.uid() de l'établissement propriétaire)
ALTER TABLE affichage_school     ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE affichage_conseils   ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE affichage_absences   ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE affichage_sorties    ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE affichage_evenements ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE affichage_cantine    ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE affichage_slides     ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE affichage_ticker     ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE affichage_config     ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Activer Row Level Security
ALTER TABLE affichage_school     ENABLE ROW LEVEL SECURITY;
ALTER TABLE affichage_conseils   ENABLE ROW LEVEL SECURITY;
ALTER TABLE affichage_absences   ENABLE ROW LEVEL SECURITY;
ALTER TABLE affichage_sorties    ENABLE ROW LEVEL SECURITY;
ALTER TABLE affichage_evenements ENABLE ROW LEVEL SECURITY;
ALTER TABLE affichage_cantine    ENABLE ROW LEVEL SECURITY;
ALTER TABLE affichage_slides     ENABLE ROW LEVEL SECURITY;
ALTER TABLE affichage_ticker     ENABLE ROW LEVEL SECURITY;
ALTER TABLE affichage_config     ENABLE ROW LEVEL SECURITY;

-- 3. Policies RLS : chaque établissement ne voit et ne modifie que ses propres données
CREATE POLICY "own_school"       ON affichage_school     FOR ALL USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_conseils"     ON affichage_conseils   FOR ALL USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_absences"     ON affichage_absences   FOR ALL USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_sorties"      ON affichage_sorties    FOR ALL USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_evenements"   ON affichage_evenements FOR ALL USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_cantine"      ON affichage_cantine    FOR ALL USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_slides"       ON affichage_slides     FOR ALL USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_ticker"       ON affichage_ticker     FOR ALL USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_config"       ON affichage_config     FOR ALL USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
