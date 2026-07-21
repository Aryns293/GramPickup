// This Vercel Serverless Function is no longer used.
// Email sending is now handled directly by the Express backend (server/utils/email.js)
// using nodemailer with Gmail SMTP and a Gmail App Password.
export default async function handler(req, res) {
  return res.status(410).json({ message: 'This endpoint is deprecated. Email is now sent directly from the server.' });
}
