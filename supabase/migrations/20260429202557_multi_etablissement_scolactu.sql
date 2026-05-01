-- Migration : multi-établissement sur scolactu
-- Chaque utilisateur authentifié ne voit que ses propres données

-- 1. Ajouter school_id sur toutes les tables
ALTER TABLE school_settings    ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE conseils            ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE absences            ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE sorties             ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE evenements          ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE cantine             ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE slides              ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ticker_messages     ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- affichage_config : remplacer la PK (cle) par un id UUID + contrainte unique (school_id, cle)
ALTER TABLE affichage_config    ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE affichage_config    DROP CONSTRAINT IF EXISTS affichage_config_pkey;
ALTER TABLE affichage_config    ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
ALTER TABLE affichage_config    ADD CONSTRAINT affichage_config_school_cle_unique UNIQUE (school_id, cle);

-- 2. Activer Row Level Security
ALTER TABLE school_settings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE conseils            ENABLE ROW LEVEL SECURITY;
ALTER TABLE absences            ENABLE ROW LEVEL SECURITY;
ALTER TABLE sorties             ENABLE ROW LEVEL SECURITY;
ALTER TABLE evenements          ENABLE ROW LEVEL SECURITY;
ALTER TABLE cantine             ENABLE ROW LEVEL SECURITY;
ALTER TABLE slides              ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticker_messages     ENABLE ROW LEVEL SECURITY;
ALTER TABLE affichage_config    ENABLE ROW LEVEL SECURITY;

-- 3. Policies : chaque utilisateur ne voit que ses propres données
CREATE POLICY "own_school_settings"  ON school_settings    FOR ALL USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_conseils"         ON conseils            FOR ALL USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_absences"         ON absences            FOR ALL USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_sorties"          ON sorties             FOR ALL USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_evenements"       ON evenements          FOR ALL USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_cantine"          ON cantine             FOR ALL USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_slides"           ON slides              FOR ALL USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_ticker_messages"  ON ticker_messages     FOR ALL USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_affichage_config" ON affichage_config    FOR ALL USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
