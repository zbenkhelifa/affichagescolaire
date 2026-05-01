-- Contrainte unique (school_id, cle) pour que l'upsert fonctionne correctement
ALTER TABLE affichage_config
  ADD CONSTRAINT affichage_config_school_cle_unique UNIQUE (school_id, cle);
