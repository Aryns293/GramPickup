import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  
  const { to, subject, html, user, pass } = req.body;
  
  if (!to || !subject || !html || !user || !pass) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from: `"GramPickup" <${user}>`,
      to,
      subject,
      html,
    });

    res.status(200).json({ success: true, message: 'Email sent successfully via Vercel Edge' });
  } catch (error) {
    console.error('Vercel Email Error:', error);
    res.status(500).json({ message: error.message || 'Failed to send email via Vercel' });
  }
}
