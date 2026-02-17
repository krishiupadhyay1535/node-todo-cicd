const fs = require('fs');
const crypto = require('crypto');

const allowedEmails = JSON.parse(
  fs.readFileSync('./allowed-emails.json', 'utf8')
).admins;

const MAGIC_SECRET = process.env.MAGIC_LINK_SECRET || 'dev-secret';

// simple in-memory session (OK for demo)
const sessions = new Set();

/* Step A: ask for email */
exports.emailPage = (req, res) => {
  res.send(`
    <form method="POST" action="/auth/email">
      <input name="email" placeholder="Enter admin email" required />
      <button type="submit">Send Magic Link</button>
    </form>
  `);
};

/* Step B: send magic link */
exports.sendMagicLink = (req, res) => {
  const email = req.body.email;

  if (!allowedEmails.includes(email)) {
    return res.status(403).send('Email not allowed');
  }

  const token = crypto
    .createHmac('sha256', MAGIC_SECRET)
    .update(email + Date.now())
    .digest('hex');

  const link = `http://${req.headers.host}/auth/verify?token=${token}`;

  // DEMO: log link instead of real email
  console.log(`Magic link for ${email}: ${link}`);

  res.send('Magic link sent to email (check logs)');
};

/* Step C: verify magic link */
exports.verifyLink = (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).send('Invalid link');
  }

  sessions.add(token);
  res.cookie('session', token);
  res.redirect('/admin');
};

/* Middleware to protect admin */
exports.requireAuth = (req, res, next) => {
  const token = req.cookies?.session;

  if (!token || !sessions.has(token)) {
    return res.redirect('/auth/email');
  }
  next();
};
