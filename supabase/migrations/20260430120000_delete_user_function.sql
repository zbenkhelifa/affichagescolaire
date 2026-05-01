-- Permet à un utilisateur authentifié de supprimer son propre compte.
-- Le CASCADE sur school_id supprime automatiquement toutes ses données.
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  DELETE FROM auth.users WHERE id = auth.uid();
$$;
