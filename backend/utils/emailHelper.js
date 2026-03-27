const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = async ({ name, email, password, role }) => {
  const roleLabel = role === "software_owner" ? "Software Owner" : "Super Admin";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body { margin: 0; padding: 0; background: #f1f5f9; font-family: 'Segoe UI', sans-serif; }
        .wrapper { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 36px 40px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
        .header p { color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 14px; }
        .body { padding: 36px 40px; }
        .greeting { font-size: 16px; color: #1e293b; font-weight: 600; margin-bottom: 12px; }
        .text { font-size: 14px; color: #64748b; line-height: 1.7; margin-bottom: 24px; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 24px; margin-bottom: 28px; }
        .card-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
        .card-row:last-child { border-bottom: none; }
        .card-label { font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .card-value { font-size: 14px; color: #1e293b; font-weight: 600; }
        .badge { background: #ede9fe; color: #7c3aed; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; }
        .btn { display: block; width: fit-content; margin: 0 auto 28px; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff; text-decoration: none; padding: 13px 32px; border-radius: 10px; font-size: 14px; font-weight: 600; text-align: center; }
        .warning { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 10px; padding: 14px 18px; font-size: 13px; color: #92400e; margin-bottom: 24px; }
        .warning strong { color: #c2410c; }
        .footer { background: #f8fafc; padding: 20px 40px; text-align: center; border-top: 1px solid #f1f5f9; }
        .footer p { font-size: 12px; color: #94a3b8; margin: 0; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>Welcome to Shnoor</h1>
          <p>Your account has been created</p>
        </div>
        <div class="body">
          <p class="greeting">Hello, ${name}!</p>
          <p class="text">
            You have been added as a <strong>${roleLabel}</strong> on the Shnoor platform.
            Below are your login credentials. Please keep them safe and change your password after your first login.
          </p>

          <div class="card">
            <div class="card-row">
              <span class="card-label">Full Name</span>
              <span class="card-value">${name}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Email</span>
              <span class="card-value">${email}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Password</span>
              <span class="card-value">${password}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Role</span>
              <span class="card-value"><span class="badge">${roleLabel}</span></span>
            </div>
          </div>

          <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/login" class="btn">
            Login to Shnoor
          </a>

          <div class="warning">
            <strong>Security Notice:</strong> Please change your password immediately after your first login. Do not share your credentials with anyone.
          </div>
        </div>
        <div class="footer">
          <p>This email was sent by Shnoor International. If you did not expect this, please contact your administrator.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Shnoor Platform" <${process.env.EMAIL_USER}>`,
    to:   email,
    subject: `Welcome to Shnoor — Your ${roleLabel} Account`,
    html,
  });
};

module.exports = { sendWelcomeEmail };
