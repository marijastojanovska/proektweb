// API-based email via Resend (no SMTP).
// Requires: RESEND_API_KEY and MAIL_FROM in env.
// Node 18+ has global fetch.

async function sendMail({ to, subject, html }){
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM || 'onboarding@resend.dev';

  const payload = { from, to, subject, html };

  if (!key) {
    // Dev fallback: no key set. Log the email instead of sending.
    console.log('[DEV EMAIL - not sent]', payload);
    return { id: 'dev-email', status: 'logged' };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend error: ${res.status} ${text}`);
  }
  return res.json();
}

module.exports = { sendMail };
