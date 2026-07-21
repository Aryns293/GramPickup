const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[Email] EMAIL_USER / EMAIL_PASS not set — skipping email send.');
    console.warn(`[Email] Would have sent to: ${to} | Subject: ${subject}`);
    return;
  }

  // Bypass Render's SMTP firewall by relaying through Vercel's Serverless Function
  const vercelApiUrl = (process.env.CLIENT_ORIGIN || 'https://gram-pickup-one.vercel.app') + '/api/send-email';

  const res = await fetch(vercelApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to,
      subject,
      html,
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    })
  });

  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'Vercel API failed to send email');
  }

  console.log(`[Email] Sent to ${to} via Vercel Relay — ${subject}`);
};

module.exports = { sendEmail };
