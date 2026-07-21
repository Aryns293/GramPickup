const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[Email] EMAIL_USER / EMAIL_PASS not set — skipping email send.');
    console.warn(`[Email] Would have sent to: ${to} | Subject: ${subject}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password (not your real password)
    },
  });

  await transporter.sendMail({
    from: `"GramPickup" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log(`[Email] Sent to ${to} — ${subject}`);
};

module.exports = { sendEmail };
