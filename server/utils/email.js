const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[Email] EMAIL_USER / EMAIL_PASS not set — skipping email send.');
    console.warn(`[Email] Would have sent to: ${to} | Subject: ${subject}`);
    return;
  }

  // Use nodemailer directly with Gmail SMTP.
  // IMPORTANT: EMAIL_PASS must be a Gmail App Password (not your regular password).
  // Generate one at: https://myaccount.google.com/apppasswords
  // (requires 2-Step Verification enabled on the Gmail account)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"GramPickup" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log(`[Email] Sent to ${to} via Gmail SMTP — ${subject}`);
};

module.exports = { sendEmail };
