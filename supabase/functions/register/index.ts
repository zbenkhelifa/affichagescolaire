import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')!;
const SENDER_EMAIL = Deno.env.get('BREVO_SENDER_EMAIL') ?? 'noreply@affichagescolaire.fr';
const SENDER_NAME = 'AffichageScolaire';

const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

function generatePassword(len = 12): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let pwd = '';
  for (let i = 0; i < len; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
  return pwd;
}

function buildEmailHtml(password: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:40px 0;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#0a1628;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.18);">
        <tr>
          <td align="center" style="padding:36px 40px 28px;background:linear-gradient(135deg,#0a1628,#112040);">
            <div style="width:56px;height:56px;background:linear-gradient(135deg,#e8b84b,#d4a030);border-radius:14px;display:inline-block;text-align:center;line-height:56px;font-size:28px;margin-bottom:16px;">🏫</div>
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">
              Affichage<span style="color:#e8b84b;">Scolaire</span>
            </h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.3);font-size:11px;text-transform:uppercase;letter-spacing:2px;">Affichage numérique</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px 28px;">
            <h2 style="margin:0 0 12px;color:#ffffff;font-size:18px;font-weight:700;">Bienvenue sur AffichageScolaire !</h2>
            <p style="margin:0 0 24px;color:rgba(255,255,255,0.6);font-size:14px;line-height:1.7;">
              Votre compte a été créé avec succès. Voici votre mot de passe temporaire pour vous connecter :
            </p>
            <div style="background:rgba(232,184,75,0.1);border:2px solid rgba(232,184,75,0.3);border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
              <p style="margin:0 0 6px;color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:2px;">Mot de passe temporaire</p>
              <p style="margin:0;color:#e8b84b;font-size:26px;font-weight:800;letter-spacing:0.15em;font-family:monospace;">${password}</p>
            </div>
            <p style="margin:0;color:rgba(255,255,255,0.5);font-size:13px;line-height:1.7;">
              Lors de votre première connexion, vous serez invité à définir un mot de passe permanent.<br/>
              Conservez ce message jusqu'à votre première connexion.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.07);text-align:center;">
            <p style="margin:0;color:rgba(255,255,255,0.2);font-size:11px;">
              Vous recevez cet email car vous avez créé un compte sur AffichageScolaire.<br/>
              Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendBrevoEmail(to: string, password: string): Promise<void> {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: to }],
      subject: 'Votre mot de passe temporaire – AffichageScolaire',
      htmlContent: buildEmailHtml(password),
    }),
  });
  if (!res.ok) throw new Error(`Brevo: ${await res.text()}`);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  try {
    const { email, schoolName, uai } = await req.json();

    if (!email || !schoolName || !uai) {
      return json({ error: 'Champs manquants (email, schoolName, uai)' }, 400);
    }

    const tempPassword = generatePassword();

    const { data: userData, error: userError } = await admin.auth.admin.createUser({
      email,
      password: tempPassword,
      user_metadata: { must_change_password: true },
      email_confirm: true,
    });

    if (userError) {
      const isDuplicate = userError.message.toLowerCase().includes('already');
      return json({ error: isDuplicate ? 'Un compte existe déjà avec cet email.' : userError.message }, isDuplicate ? 409 : 500);
    }

    const userId = userData.user.id;

    const { error: dbError } = await admin
      .from('school_settings')
      .upsert({ school_id: userId, name: schoolName, uai: uai.toUpperCase(), logo: '🏫', subtitle: '' }, { onConflict: 'school_id' });

    if (dbError) {
      await admin.auth.admin.deleteUser(userId);
      return json({ error: dbError.message }, 500);
    }

    await sendBrevoEmail(email, tempPassword);

    return json({ success: true });
  } catch (err: any) {
    console.error(err);
    return json({ error: err.message ?? 'Erreur serveur' }, 500);
  }
});
