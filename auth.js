const nodemailer = require('nodemailer');

// ================= OTP STORE (NO DATABASE) =================
const otpStore = {};

// ================= OTP GENERATOR =================
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ================= MAIL SETUP =================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendMail(to, subject, text) {
  await transporter.sendMail({
    from: `"Admin Login" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text
  });
}

// ================= LOGIN PAGE =================
exports.emailPage = (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Admin Login</title>
</head>
<body>
  <h2>Admin Login (OTP)</h2>

  <form method="POST" action="/auth/send-otp">
    <input type="email" name="email" placeholder="Enter email" required />
    <button type="submit">Send OTP</button>
  </form>

  <br><hr><br>

  <form method="POST" action="/auth/verify-otp">
    <input type="email" name="email" placeholder="Email" required />
    <input type="text" name="otp" placeholder="Enter OTP" required />
    <button type="submit">Verify OTP</button>
  </form>
</body>
</html>
  `);
};

// ================= SEND OTP =================
exports.sendOTP = async (req, res) => {
  const email = req.body.email;

  if (!email) return res.send("Email required");

  const otp = generateOTP();

  otpStore[email] = {
    otp,
    expires: Date.now() + 5 * 60 * 1000 // 5 minutes
  };

  await sendMail(email, "Your OTP", `Your OTP is ${otp}`);

  res.send("OTP sent to your email. Go back and verify.");
};

// ================= VERIFY OTP =================
exports.verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  const data = otpStore[email];

  if (!data) return res.send("OTP not found");
  if (Date.now() > data.expires) return res.send("OTP expired");
  if (data.otp !== otp) return res.send("Wrong OTP");

  // login success
  res.cookie("auth", email, { httpOnly: true });

  delete otpStore[email];

  res.redirect('/admin');
};

// ================= AUTH MIDDLEWARE =================
exports.requireAuth = (req, res, next) => {
  const email = req.cookies?.auth;

  if (!email) {
    return res.redirect('/auth/email');
  }
  next();
};
