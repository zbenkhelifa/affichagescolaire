-- Fix: associer les données orphelines (school_id IS NULL) au compte propriétaire
-- Contexte : "Lycée Georges Brassens" (id 1b105a2f) a été créé avant la migration multi-tenant
-- Le propriétaire s'est connecté après la migration et une école vide (id d5434dff, school_id c337b496) a été créée

DO $$
DECLARE
  owner_uuid UUID := 'c337b496-396a-407e-b799-b911778878f7';
  school_uuid UUID := '1b105a2f-4473-4ae2-9c2e-4eb7d7eb5eaf';
  empty_school_uuid UUID := 'd5434dff-923c-436e-a1b2-9d3489ca2755';
BEGIN
  -- 1. Associer l'école nommée au propriétaire
  UPDATE school_settings SET school_id = owner_uuid WHERE id = school_uuid AND school_id IS NULL;

  -- 2. Attribuer toutes les données orphelines à ce compte (tables sans contrainte unique)
  UPDATE conseils         SET school_id = owner_uuid WHERE school_id IS NULL;
  UPDATE absences         SET school_id = owner_uuid WHERE school_id IS NULL;
  UPDATE sorties          SET school_id = owner_uuid WHERE school_id IS NULL;
  UPDATE evenements       SET school_id = owner_uuid WHERE school_id IS NULL;
  UPDATE cantine          SET school_id = owner_uuid WHERE school_id IS NULL;
  UPDATE slides           SET school_id = owner_uuid WHERE school_id IS NULL;
  UPDATE ticker_messages  SET school_id = owner_uuid WHERE school_id IS NULL;

  -- 3. Pour affichage_config : supprimer les lignes en conflit, puis mettre à jour les restantes
  DELETE FROM affichage_config
  WHERE school_id IS NULL
    AND cle IN (
      SELECT cle FROM affichage_config WHERE school_id = owner_uuid
    );
  UPDATE affichage_config SET school_id = owner_uuid WHERE school_id IS NULL;

  -- 4. Supprimer l'école vide créée après la migration
  DELETE FROM school_settings WHERE id = empty_school_uuid AND name = '';
END $$;
