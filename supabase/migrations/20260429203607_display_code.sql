-- Migration : code d'affichage par établissement
-- Les élèves utilisent ce code pour accéder à l'affichage en lecture seule

-- 1. Ajouter display_code dans school_settings (6 caractères alphanumériques majuscules)
ALTER TABLE school_settings
  ADD COLUMN IF NOT EXISTS display_code TEXT UNIQUE
  DEFAULT upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 6));

-- Générer un code pour les lignes existantes
UPDATE school_settings
SET display_code = upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 6))
WHERE display_code IS NULL;

-- 2. Remplacer les policies FOR ALL par SELECT public + écriture admin uniquement

-- school_settings
DROP POLICY IF EXISTS "own_school_settings" ON school_settings;
CREATE POLICY "public_select_school_settings" ON school_settings FOR SELECT USING (true);
CREATE POLICY "own_insert_school_settings"    ON school_settings FOR INSERT WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_update_school_settings"    ON school_settings FOR UPDATE USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_delete_school_settings"    ON school_settings FOR DELETE USING (school_id = auth.uid());

-- conseils
DROP POLICY IF EXISTS "own_conseils" ON conseils;
CREATE POLICY "public_select_conseils" ON conseils FOR SELECT USING (true);
CREATE POLICY "own_insert_conseils"    ON conseils FOR INSERT WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_update_conseils"    ON conseils FOR UPDATE USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_delete_conseils"    ON conseils FOR DELETE USING (school_id = auth.uid());

-- absences
DROP POLICY IF EXISTS "own_absences" ON absences;
CREATE POLICY "public_select_absences" ON absences FOR SELECT USING (true);
CREATE POLICY "own_insert_absences"    ON absences FOR INSERT WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_update_absences"    ON absences FOR UPDATE USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_delete_absences"    ON absences FOR DELETE USING (school_id = auth.uid());

-- sorties
DROP POLICY IF EXISTS "own_sorties" ON sorties;
CREATE POLICY "public_select_sorties" ON sorties FOR SELECT USING (true);
CREATE POLICY "own_insert_sorties"    ON sorties FOR INSERT WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_update_sorties"    ON sorties FOR UPDATE USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_delete_sorties"    ON sorties FOR DELETE USING (school_id = auth.uid());

-- evenements
DROP POLICY IF EXISTS "own_evenements" ON evenements;
CREATE POLICY "public_select_evenements" ON evenements FOR SELECT USING (true);
CREATE POLICY "own_insert_evenements"    ON evenements FOR INSERT WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_update_evenements"    ON evenements FOR UPDATE USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_delete_evenements"    ON evenements FOR DELETE USING (school_id = auth.uid());

-- cantine
DROP POLICY IF EXISTS "own_cantine" ON cantine;
CREATE POLICY "public_select_cantine" ON cantine FOR SELECT USING (true);
CREATE POLICY "own_insert_cantine"    ON cantine FOR INSERT WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_update_cantine"    ON cantine FOR UPDATE USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_delete_cantine"    ON cantine FOR DELETE USING (school_id = auth.uid());

-- slides
DROP POLICY IF EXISTS "own_slides" ON slides;
CREATE POLICY "public_select_slides" ON slides FOR SELECT USING (true);
CREATE POLICY "own_insert_slides"    ON slides FOR INSERT WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_update_slides"    ON slides FOR UPDATE USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_delete_slides"    ON slides FOR DELETE USING (school_id = auth.uid());

-- ticker_messages
DROP POLICY IF EXISTS "own_ticker_messages" ON ticker_messages;
CREATE POLICY "public_select_ticker" ON ticker_messages FOR SELECT USING (true);
CREATE POLICY "own_insert_ticker"    ON ticker_messages FOR INSERT WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_update_ticker"    ON ticker_messages FOR UPDATE USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_delete_ticker"    ON ticker_messages FOR DELETE USING (school_id = auth.uid());

-- affichage_config
DROP POLICY IF EXISTS "own_affichage_config" ON affichage_config;
CREATE POLICY "public_select_config" ON affichage_config FOR SELECT USING (true);
CREATE POLICY "own_insert_config"    ON affichage_config FOR INSERT WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_update_config"    ON affichage_config FOR UPDATE USING (school_id = auth.uid()) WITH CHECK (school_id = auth.uid());
CREATE POLICY "own_delete_config"    ON affichage_config FOR DELETE USING (school_id = auth.uid());
