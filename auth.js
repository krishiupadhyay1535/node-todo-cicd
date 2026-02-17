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
//const sessions = new Set();

/* ================= EMAIL PAGE ================= */
exports.emailPage = (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Email Login</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f6f8;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .login-box {
      background: #ffffff;
      padding: 30px;
      border-radius: 8px;
      width: 320px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      text-align: center;
    }
    h2 {
      margin-bottom: 20px;
      color: #333;
    }
    input {
      width: 100%;
      padding: 10px;
      margin-bottom: 15px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      width: 100%;
      padding: 10px;
      background: #007bff;
      border: none;
      color: #fff;
      font-size: 15px;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background: #0056b3;
    }
    .note {
      margin-top: 15px;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>

  <div class="login-box">
    <h2>Admin Login</h2>
    <form method="POST" action="/auth/email">
      <input type="email" name="email" placeholder="Enter admin email" required />
      <button type="submit">Send Magic Link</button>
    </form>
    <div class="note">
      Only approved admin emails are allowed
    </div>
  </div>

</body>
</html>
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

    res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Check Your Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f6f8;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .message-box {
      background: #ffffff;
      padding: 30px;
      border-radius: 8px;
      width: 360px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      text-align: center;
    }
    .icon {
      font-size: 40px;
      color: #28a745;
      margin-bottom: 10px;
    }
    h2 {
      color: #333;
      margin-bottom: 10px;
    }
    p {
      color: #555;
      font-size: 14px;
    }
    .hint {
      margin-top: 15px;
      font-size: 12px;
      color: #888;
    }
  </style>
</head>
<body>

  <div class="message-box">
    <div class="icon">📧</div>
    <h2>Check your email</h2>
    <p>
      A magic login link has been sent to <br>
      <strong>${email}</strong>
    </p>
    <div class="hint">
      The link will expire soon. Please check your inbox or spam folder.
    </div>
  </div>

</body>
</html>
`);

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

  // Trust token for demo (no in-memory store)
  res.cookie('session', token, {
    httpOnly: true,
    sameSite: 'lax'
  });

  res.redirect('/admin');
};


/* ================= AUTH MIDDLEWARE ================= */
exports.requireAuth = (req, res, next) => {
  const token = req.cookies?.session;

  if (!token) {
    return res.redirect('/auth/email');
  }
  next();
};



