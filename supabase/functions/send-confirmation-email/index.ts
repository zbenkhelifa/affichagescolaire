import { Resend } from 'npm:resend';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const HOOK_SECRET = Deno.env.get('SEND_EMAIL_HOOK_SECRET');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';

const SUBJECTS: Record<string, string> = {
  signup:        'Confirmez votre inscription – TableauScolaire',
  recovery:      'Réinitialisation de votre mot de passe – TableauScolaire',
  email_change:  'Confirmez votre nouvel email – TableauScolaire',
  invite:        'Vous êtes invité – TableauScolaire',
};

function buildConfirmUrl(tokenHash: string, type: string, redirectTo: string) {
  return `${SUPABASE_URL}/auth/v1/verify?token=${tokenHash}&type=${type}&redirect_to=${encodeURIComponent(redirectTo)}`;
}

function buildHtml(title: string, intro: string, ctaLabel: string, ctaUrl: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#0a1628;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.18);">

          <!-- Header -->
          <tr>
            <td align="center" style="padding:36px 40px 28px;background:linear-gradient(135deg,#0a1628,#112040);">
              <div style="width:56px;height:56px;background:linear-gradient(135deg,#e8b84b,#d4a030);border-radius:14px;display:inline-flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:16px;">🏫</div>
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">
                Tableau<span style="color:#e8b84b;">Scolaire</span>
              </h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.3);font-size:11px;text-transform:uppercase;letter-spacing:2px;">Affichage numérique</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 28px;">
              <h2 style="margin:0 0 12px;color:#ffffff;font-size:18px;font-weight:700;">${title}</h2>
              <p style="margin:0 0 28px;color:rgba(255,255,255,0.6);font-size:14px;line-height:1.7;">${intro}</p>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${ctaUrl}"
                       style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#e8b84b,#d4a030);color:#0a1628;text-decoration:none;border-radius:10px;font-weight:800;font-size:14px;letter-spacing:0.3px;">
                      ${ctaLabel}
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;color:rgba(255,255,255,0.3);font-size:11px;line-height:1.6;text-align:center;">
                Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br />
                <a href="${ctaUrl}" style="color:#e8b84b;word-break:break-all;">${ctaUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.07);text-align:center;">
              <p style="margin:0;color:rgba(255,255,255,0.2);font-size:11px;">
                Vous recevez cet email car vous avez créé un compte sur TableauScolaire.<br />
                Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Vérification du secret hook
  if (HOOK_SECRET) {
    const auth = req.headers.get('Authorization');
    if (auth !== `Bearer ${HOOK_SECRET}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  const payload = await req.json();
  const { user, email_data } = payload as {
    user: { email: string };
    email_data: {
      email_action_type: string;
      token_hash: string;
      redirect_to: string;
    };
  };

  const { email_action_type, token_hash, redirect_to } = email_data;
  const confirmUrl = buildConfirmUrl(token_hash, email_action_type, redirect_to);

  const configs: Record<string, { intro: string; cta: string }> = {
    signup: {
      intro: 'Merci de créer un compte pour votre établissement sur TableauScolaire. Cliquez sur le bouton ci-dessous pour confirmer votre adresse email et activer votre compte.',
      cta: 'Confirmer mon inscription',
    },
    recovery: {
      intro: 'Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe. Ce lien expire dans 1 heure.',
      cta: 'Réinitialiser mon mot de passe',
    },
    email_change: {
      intro: 'Vous avez demandé la modification de votre adresse email. Cliquez sur le bouton ci-dessous pour confirmer votre nouvel email.',
      cta: 'Confirmer mon nouvel email',
    },
    invite: {
      intro: 'Vous avez été invité à rejoindre TableauScolaire. Cliquez sur le bouton ci-dessous pour accepter l\'invitation et créer votre compte.',
      cta: 'Accepter l\'invitation',
    },
  };

  const cfg = configs[email_action_type] ?? configs.signup;
  const subject = SUBJECTS[email_action_type] ?? SUBJECTS.signup;
  const html = buildHtml(subject.split(' – ')[0], cfg.intro, cfg.cta, confirmUrl);

  const { error } = await resend.emails.send({
    from: 'TableauScolaire <noreply@monlycee.net>',
    to: user.email,
    subject,
    html,
  });

  if (error) {
    console.error('Resend error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({}), {
    headers: { 'Content-Type': 'application/json' },
  });
});
