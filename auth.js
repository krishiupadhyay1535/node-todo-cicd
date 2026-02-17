const fs = require('fs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Load allowed emails
const allowedEmails = JSON.parse(
  fs.readFileSync('./allowed-emails.json', 'utf8')
).admins;

// Secret for signing magic links
const MAGIC_SECRET = process.env.MAGIC_LINK_SECRET || 'dev-secret';

// Simple in-memory session store (OK for demo)
const sessions = new Set();

/* ================= EMAIL PAGE ================= */
exports.emailPage = (req, res) => {
  res.send(`
    <h2>Admin Login</h2>
    <form method="POST" action="/auth/email">
      <input name="email" placeholder="Enter admin email" required />
      <button type="submit">Send Magic Link</button>
    </form>
  `);
};

/* ================= SEND MAGIC LINK ================= */
exports.sendMagicLink = async (req, res) => {
  const email = req.body.email;

  // Check allowlist
  if (!allowedEmails.includes(email)) {
    return res.status(403).send('Email not allowed');
  }

  // Create token
  const token = crypto
    .createHmac('sha256', MAGIC_SECRET)
    .update(email + Date.now())
    .digest('hex');

  const link = `http://${req.headers.host}/auth/verify?token=${token}`;

  // Create SMTP transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: `"Admin Access" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your Magic Login Link',
      html: `
        <p>Hello,</p>
        <p>Click the link below to login as admin:</p>
        <p><a href="${link}">${link}</a></p>
        <p>This link is valid for a short time.</p>
      `
    });

    res.send('Magic link sent to your email');
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).send('Failed to send email');
  }
};

/* ================= VERIFY MAGIC LINK ================= */
exports.verifyLink = (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).send('Invalid link');
  }

  sessions.add(token);
  res.cookie('session', token, { httpOnly: true });
  res.redirect('/admin');
};

/* ================= AUTH MIDDLEWARE ================= */
exports.requireAuth = (req, res, next) => {
  const token = req.cookies?.session;

  if (!token || !sessions.has(token)) {
    return res.redirect('/auth/email');
  }
  next();
};


