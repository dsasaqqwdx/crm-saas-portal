// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendWelcomeEmail = async ({ name, email, password, role }) => {
//   const roleLabel = role === "software_owner" ? "Software Owner" : "Super Admin";

//   const html = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8" />
//       <style>
//         body { margin: 0; padding: 0; background: #f1f5f9; font-family: 'Segoe UI', sans-serif; }
//         .wrapper { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
//         .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 36px 40px; text-align: center; }
//         .header h1 { color: #fff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
//         .header p { color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 14px; }
//         .body { padding: 36px 40px; }
//         .greeting { font-size: 16px; color: #1e293b; font-weight: 600; margin-bottom: 12px; }
//         .text { font-size: 14px; color: #64748b; line-height: 1.7; margin-bottom: 24px; }
//         .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 24px; margin-bottom: 28px; }
//         .card-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
//         .card-row:last-child { border-bottom: none; }
//         .card-label { font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
//         .card-value { font-size: 14px; color: #1e293b; font-weight: 600; }
//         .badge { background: #ede9fe; color: #7c3aed; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; }
//         .btn { display: block; width: fit-content; margin: 0 auto 28px; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff; text-decoration: none; padding: 13px 32px; border-radius: 10px; font-size: 14px; font-weight: 600; text-align: center; }
//         .warning { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 10px; padding: 14px 18px; font-size: 13px; color: #92400e; margin-bottom: 24px; }
//         .warning strong { color: #c2410c; }
//         .footer { background: #f8fafc; padding: 20px 40px; text-align: center; border-top: 1px solid #f1f5f9; }
//         .footer p { font-size: 12px; color: #94a3b8; margin: 0; }
//       </style>
//     </head>
//     <body>
//       <div class="wrapper">
//         <div class="header">
//           <h1>Welcome to Shnoor</h1>
//           <p>Your account has been created</p>
//         </div>
//         <div class="body">
//           <p class="greeting">Hello, ${name}!</p>
//           <p class="text">
//             You have been added as a <strong>${roleLabel}</strong> on the Shnoor platform.
//             Below are your login credentials. Please keep them safe and change your password after your first login.
//           </p>

//           <div class="card">
//             <div class="card-row">
//               <span class="card-label">Full Name</span>
//               <span class="card-value">${name}</span>
//             </div>
//             <div class="card-row">
//               <span class="card-label">Email</span>
//               <span class="card-value">${email}</span>
//             </div>
//             <div class="card-row">
//               <span class="card-label">Password</span>
//               <span class="card-value">${password}</span>
//             </div>
//             <div class="card-row">
//               <span class="card-label">Role</span>
//               <span class="card-value"><span class="badge">${roleLabel}</span></span>
//             </div>
//           </div>

//           <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/login" class="btn">
//             Login to Shnoor
//           </a>

//           <div class="warning">
//             <strong>Security Notice:</strong> Please change your password immediately after your first login. Do not share your credentials with anyone.
//           </div>
//         </div>
//         <div class="footer">
//           <p>This email was sent by Shnoor International. If you did not expect this, please contact your administrator.</p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `;

//   await transporter.sendMail({
//     from: `"Shnoor Platform" <${process.env.EMAIL_USER}>`,
//     to:   email,
//     subject: `Welcome to Shnoor — Your ${roleLabel} Account`,
//     html,
//   });
// };

// module.exports = { sendWelcomeEmail };
// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendWelcomeEmail = async ({ name, email, password, role }) => {
  
// };

// const sendPayslipEmail = async (data) => {
//   const { name, email, companyName, netSalary, payDate } = data;

//   const html = `
//     <div style="font-family: sans-serif; padding: 20px; color: #333;">
//       <h2>Salary Payslip</h2>
//       <p>Hello <strong>${name}</strong>,</p>
//       <p>Your payment for the period ending <strong>${new Date(payDate).toLocaleDateString()}</strong> has been processed by <strong>${companyName}</strong>.</p>
//       <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
//         <p><strong>Net Salary:</strong> {netSalary}</p>
//       </div>
//       <p>You can login to the portal to download your full PDF payslip.</p>
//       <br />
//       <p>Best Regards,<br/>${companyName} Payroll Team</p>
//     </div>
//   `;

//   await transporter.sendMail({
//     from: `"Payroll Dept" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: `Payslip Issued - ${new Date(payDate).toLocaleDateString()}`,
//     html,
//   });
// };


// module.exports = { 
//   sendWelcomeEmail, 
//   sendPayslipEmail 
// };
// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendWelcomeEmail = async ({ name, email, password, role }) => {
//   const roleLabel = role === "software_owner" ? "Software Owner" : "Super Admin";

//   const html = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8" />
//       <style>
//         body { margin: 0; padding: 0; background: #f1f5f9; font-family: 'Segoe UI', sans-serif; }
//         .wrapper { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
//         .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 36px 40px; text-align: center; }
//         .header h1 { color: #fff; margin: 0; font-size: 24px; font-weight: 700; }
//         .header p  { color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 14px; }
//         .body { padding: 36px 40px; }
//         .greeting { font-size: 16px; color: #1e293b; font-weight: 600; margin-bottom: 12px; }
//         .text { font-size: 14px; color: #64748b; line-height: 1.7; margin-bottom: 24px; }
//         .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 24px; margin-bottom: 28px; }
//         .card-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
//         .card-row:last-child { border-bottom: none; }
//         .card-label { font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
//         .card-value { font-size: 14px; color: #1e293b; font-weight: 600; }
//         .badge { background: #ede9fe; color: #7c3aed; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; }
//         .btn { display: block; width: fit-content; margin: 0 auto 28px; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff; text-decoration: none; padding: 13px 32px; border-radius: 10px; font-size: 14px; font-weight: 600; text-align: center; }
//         .warning { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 10px; padding: 14px 18px; font-size: 13px; color: #92400e; margin-bottom: 24px; }
//         .warning strong { color: #c2410c; }
//         .footer { background: #f8fafc; padding: 20px 40px; text-align: center; border-top: 1px solid #f1f5f9; }
//         .footer p { font-size: 12px; color: #94a3b8; margin: 0; }
//       </style>
//     </head>
//     <body>
//       <div class="wrapper">
//         <div class="header">
//           <h1>Welcome to Shnoor</h1>
//           <p>Your account has been created</p>
//         </div>
//         <div class="body">
//           <p class="greeting">Hello, ${name}!</p>
//           <p class="text">
//             You have been added as a <strong>${roleLabel}</strong> on the Shnoor platform.
//             Below are your login credentials. Please keep them safe and change your password after your first login.
//           </p>
//           <div class="card">
//             <div class="card-row">
//               <span class="card-label">Full Name</span>
//               <span class="card-value">${name}</span>
//             </div>
//             <div class="card-row">
//               <span class="card-label">Email</span>
//               <span class="card-value">${email}</span>
//             </div>
//             <div class="card-row">
//               <span class="card-label">Password</span>
//               <span class="card-value">${password}</span>
//             </div>
//             <div class="card-row">
//               <span class="card-label">Role</span>
//               <span class="card-value"><span class="badge">${roleLabel}</span></span>
//             </div>
//           </div>
//           <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/login" class="btn">
//             Login to Shnoor
//           </a>
//           <div class="warning">
//             <strong>Security Notice:</strong> Please change your password immediately after your first login. Do not share your credentials with anyone.
//           </div>
//         </div>
//         <div class="footer">
//           <p>This email was sent by Shnoor International. If you did not expect this, please contact your administrator.</p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `;

//   await transporter.sendMail({
//     from:    `"Shnoor Platform" <${process.env.EMAIL_USER}>`,
//     to:      email,
//     subject: `Welcome to Shnoor — Your ${roleLabel} Account`,
//     html,
//   });
// };

// const sendPayslipEmail = async ({
//   name, email, companyName, employeeId, payrollId,
//   baseSalary, bonus, bonusReason,
//   allowances, allowanceReason,
//   deductions, deductionReason,
//   tax, taxReason,
//   netSalary, payDate, payPeriod, notes,
// }) => {
//   const rupee  = (n) => "&#8377;" + parseFloat(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
//   const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

//   const earningRows = [
//     { label: "Basic Salary",                        amount: baseSalary  },
//     bonus      > 0 ? { label: bonusReason      || "Bonus",       amount: bonus      } : null,
//     allowances > 0 ? { label: allowanceReason  || "Allowances",  amount: allowances } : null,
//   ].filter(Boolean);

//   const deductionRows = [
//     deductions > 0 ? { label: deductionReason  || "Deductions",  amount: deductions } : null,
//     tax        > 0 ? { label: taxReason        || "Tax / TDS",   amount: tax        } : null,
//   ].filter(Boolean);

//   const grossEarnings   = parseFloat(baseSalary || 0) + parseFloat(bonus || 0) + parseFloat(allowances || 0);
//   const totalDeductions = parseFloat(deductions || 0) + parseFloat(tax || 0);

//   const earningHtml   = earningRows.map(r => `
//     <tr>
//       <td style="padding:8px 12px;font-size:13px;color:#374151;border-bottom:1px solid #f1f5f9;">${r.label}</td>
//       <td style="padding:8px 12px;font-size:13px;color:#16a34a;font-weight:600;text-align:right;border-bottom:1px solid #f1f5f9;">${rupee(r.amount)}</td>
//     </tr>`).join("");

//   const deductionHtml = deductionRows.length > 0
//     ? deductionRows.map(r => `
//     <tr>
//       <td style="padding:8px 12px;font-size:13px;color:#374151;border-bottom:1px solid #f1f5f9;">${r.label}</td>
//       <td style="padding:8px 12px;font-size:13px;color:#ef4444;font-weight:600;text-align:right;border-bottom:1px solid #f1f5f9;">&#8722; ${rupee(r.amount)}</td>
//     </tr>`).join("")
//     : `<tr><td colspan="2" style="padding:8px 12px;font-size:13px;color:#94a3b8;text-align:center;">No deductions</td></tr>`;

//   const html = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8"/>
//       <style>
//         body { margin:0; padding:0; background:#f1f5f9; font-family:'Segoe UI',sans-serif; }
//         .wrap { max-width:600px; margin:40px auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,0.08); }
//         .hdr  { background:linear-gradient(135deg,#059669,#0d9488); padding:28px 40px; text-align:center; }
//         .hdr h1 { color:#fff; margin:0; font-size:22px; font-weight:700; }
//         .hdr p  { color:rgba(255,255,255,0.85); margin:5px 0 0; font-size:13px; }
//         .body { padding:28px 36px; }
//         .net-box { background:linear-gradient(135deg,#059669,#0d9488); border-radius:14px; padding:22px; text-align:center; margin:20px 0; }
//         .net-label  { color:rgba(255,255,255,0.8); font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; }
//         .net-amount { color:#fff; font-size:34px; font-weight:800; letter-spacing:-1px; margin:4px 0 0; }
//         .meta { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px; }
//         .chip { background:#f1f5f9; border-radius:8px; padding:7px 13px; font-size:12px; color:#475569; font-weight:600; }
//         .section-title { font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.06em; margin:18px 0 8px; }
//         table { width:100%; border-collapse:collapse; background:#f8fafc; border-radius:10px; overflow:hidden; }
//         .totals-row td { padding:9px 12px; font-size:13px; font-weight:700; background:#e8f8f3; }
//         .login-btn { display:block; width:fit-content; margin:20px auto 0; background:linear-gradient(135deg,#059669,#0d9488); color:#fff; text-decoration:none; padding:11px 28px; border-radius:10px; font-size:14px; font-weight:600; text-align:center; }
//         .footer { background:#f8fafc; padding:16px 36px; text-align:center; border-top:1px solid #f1f5f9; }
//         .footer p { font-size:11px; color:#94a3b8; margin:0; }
//         ${notes ? `.notes { background:#fffbeb; border:1px solid #fde68a; border-radius:8px; padding:12px 16px; font-size:13px; color:#92400e; margin-top:16px; }` : ""}
//       </style>
//     </head>
//     <body>
//       <div class="wrap">
//         <div class="hdr">
//           <h1>&#8377; Salary Credited</h1>
//           <p>${companyName} &mdash; Payslip for ${fmtDate(payDate)}</p>
//         </div>
//         <div class="body">
//           <p style="font-size:15px;font-weight:600;color:#1e293b;margin:0 0 6px;">Hello, ${name}!</p>
//           <p style="font-size:13px;color:#64748b;margin:0 0 16px;">Your salary has been processed. Here is a detailed breakdown of your payslip.</p>

//           <div class="net-box">
//             <div class="net-label">Net Salary Credited</div>
//             <div class="net-amount">&#8377;${parseFloat(netSalary || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
//           </div>

//           <div class="meta">
//             <span class="chip">&#128197; ${fmtDate(payDate)}</span>
//             <span class="chip">&#127970; ${companyName}</span>
//             <span class="chip">&#128100; EMP-${String(employeeId).padStart(4, "0")}</span>
//             ${payPeriod ? `<span class="chip">&#128197; ${payPeriod}</span>` : ""}
//           </div>

//           <div class="section-title">&#128200; Earnings</div>
//           <table>
//             <tbody>
//               ${earningHtml}
//               <tr class="totals-row">
//                 <td>Gross Earnings</td>
//                 <td style="text-align:right;color:#059669;">&#8377;${parseFloat(grossEarnings).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
//               </tr>
//             </tbody>
//           </table>

//           <div class="section-title">&#128202; Deductions</div>
//           <table>
//             <tbody>
//               ${deductionHtml}
//               <tr class="totals-row">
//                 <td>Total Deductions</td>
//                 <td style="text-align:right;color:#ef4444;">&#8722; &#8377;${parseFloat(totalDeductions).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
//               </tr>
//             </tbody>
//           </table>

//           ${notes ? `<div class="notes"><strong>Notes:</strong> ${notes}</div>` : ""}

//           <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/employee/payroll" class="login-btn">
//             View &amp; Download Full Payslip
//           </a>
//         </div>
//         <div class="footer">
//           <p>This is an automated payroll notification from ${companyName} via Shnoor Platform.</p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `;

//   await transporter.sendMail({
//     from:    `"${companyName} Payroll" <${process.env.EMAIL_USER}>`,
//     to:      email,
//     subject: `Salary Credited — ${fmtDate(payDate)} | ${companyName}`,
//     html,
//   });
// };

// module.exports = { sendWelcomeEmail, sendPayslipEmail };
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ─────────────────────────────────────────────────────────────
   sendWelcomeEmail
   Sent when company_admin creates any user (employee, admin, etc.)
   via the internal admin panel (POST /api/auth/register-user).
   Includes login credentials so the new user can sign in.
───────────────────────────────────────────────────────────── */
const sendWelcomeEmail = async ({ name, email, password, role }) => {
  const roleLabels = {
    employee:        "Employee",
    company_admin:   "Company Administrator",
    super_admin:     "Super Administrator",
    software_owner:  "Software Owner",
  };
  const roleLabel = roleLabels[role] || role;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8"/>
      <style>
        body { margin:0; padding:0; background:#f1f5f9; font-family:'Segoe UI',sans-serif; }
        .wrap { max-width:560px; margin:40px auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,.08); }
        .hdr  { background:linear-gradient(135deg,#4f46e5,#7c3aed); padding:32px 40px; text-align:center; }
        .hdr h1 { color:#fff; margin:0; font-size:22px; font-weight:700; }
        .hdr p  { color:rgba(255,255,255,.8); margin:6px 0 0; font-size:13px; }
        .body { padding:32px 40px; }
        .card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:20px 24px; margin:20px 0; }
        .row  { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #f1f5f9; }
        .row:last-child { border-bottom:none; }
        .lbl  { font-size:11px; color:#94a3b8; font-weight:700; text-transform:uppercase; letter-spacing:.05em; }
        .val  { font-size:14px; color:#1e293b; font-weight:600; }
        .badge { background:#ede9fe; color:#7c3aed; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:700; }
        .btn  { display:block; width:fit-content; margin:24px auto; background:linear-gradient(135deg,#4f46e5,#7c3aed); color:#fff; text-decoration:none; padding:13px 32px; border-radius:10px; font-size:14px; font-weight:600; }
        .warn { background:#fff7ed; border:1px solid #fed7aa; border-radius:10px; padding:14px 18px; font-size:13px; color:#92400e; margin-top:20px; }
        .warn strong { color:#c2410c; }
        .foot { background:#f8fafc; padding:18px 40px; text-align:center; border-top:1px solid #f1f5f9; }
        .foot p { font-size:12px; color:#94a3b8; margin:0; }
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="hdr">
          <h1>Welcome to Shnoor</h1>
          <p>Your account has been created by your administrator</p>
        </div>
        <div class="body">
          <p style="font-size:15px;font-weight:600;color:#1e293b;margin:0 0 6px;">Hello, ${name}!</p>
          <p style="font-size:13px;color:#64748b;margin:0 0 4px;">
            Your <strong>${roleLabel}</strong> account on the Shnoor HR platform is ready.
            Use the credentials below to sign in.
          </p>

          <div class="card">
            <div class="row"><span class="lbl">Full Name</span><span class="val">${name}</span></div>
            <div class="row"><span class="lbl">Email</span><span class="val">${email}</span></div>
            <div class="row"><span class="lbl">Password</span><span class="val">${password}</span></div>
            <div class="row"><span class="lbl">Role</span><span class="val"><span class="badge">${roleLabel}</span></span></div>
          </div>

          <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/login" class="btn">
            Login to Shnoor →
          </a>

          <div class="warn">
            <strong>Security Notice:</strong> Please change your password immediately after your first login.
            Never share your credentials with anyone.
          </div>
        </div>
        <div class="foot">
          <p>This email was sent by Shnoor International. If you did not expect this, contact your administrator.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from:    `"Shnoor Platform" <${process.env.EMAIL_USER}>`,
    to:      email,
    subject: `Welcome to Shnoor — Your ${roleLabel} Account`,
    html,
  });
};

/* ─────────────────────────────────────────────────────────────
   sendTrialEmail
   Sent when a new company self-registers (public /register).
   Shows trial end date and feature list.
───────────────────────────────────────────────────────────── */
const sendTrialEmail = async ({ name, email, companyName, trialEnd }) => {
  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8"/>
      <style>
        body { margin:0; padding:0; background:#f1f5f9; font-family:'Segoe UI',sans-serif; }
        .wrap { max-width:560px; margin:40px auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,.08); }
        .hdr  { background:linear-gradient(135deg,#4f46e5,#7c3aed); padding:32px 40px; text-align:center; }
        .hdr h1 { color:#fff; margin:0; font-size:22px; font-weight:700; }
        .hdr p  { color:rgba(255,255,255,.85); margin:6px 0 0; font-size:13px; }
        .body { padding:32px 40px; }
        .trial-box { background:linear-gradient(135deg,#4f46e5,#7c3aed); border-radius:14px; padding:22px; text-align:center; margin:20px 0; }
        .days  { color:#fff; font-size:52px; font-weight:800; line-height:1; }
        .dlabel { color:rgba(255,255,255,.85); font-size:13px; margin-top:6px; }
        .dend   { color:rgba(255,255,255,.9); font-size:12px; margin-top:8px; font-weight:600; }
        .features { background:#f8fafc; border-radius:12px; padding:18px 22px; margin:20px 0; }
        .feat     { display:flex; align-items:center; gap:10px; padding:5px 0; font-size:13px; color:#374151; }
        .btn  { display:block; width:fit-content; margin:20px auto; background:linear-gradient(135deg,#4f46e5,#7c3aed); color:#fff; text-decoration:none; padding:13px 32px; border-radius:10px; font-size:14px; font-weight:600; }
        .warn { background:#fff7ed; border:1px solid #fed7aa; border-radius:10px; padding:14px 18px; font-size:13px; color:#92400e; margin-top:20px; }
        .foot { background:#f8fafc; padding:18px 40px; text-align:center; border-top:1px solid #f1f5f9; }
        .foot p { font-size:12px; color:#94a3b8; margin:0; }
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="hdr">
          <h1>Welcome to Shnoor! 🎉</h1>
          <p>${companyName} — Your free trial has started</p>
        </div>
        <div class="body">
          <p style="font-size:15px;font-weight:600;color:#1e293b;margin:0 0 6px;">Hello, ${name}!</p>
          <p style="font-size:13px;color:#64748b;margin:0 0 4px;">
            <strong>${companyName}</strong> is now registered on Shnoor HR.
            You have full access to all features during your free trial.
          </p>

          <div class="trial-box">
            <div class="days">15</div>
            <div class="dlabel">Day Free Trial</div>
            <div class="dend">Trial ends on ${fmtDate(trialEnd)}</div>
          </div>

          <div class="features">
            <div style="font-size:12px;font-weight:700;color:#374151;margin-bottom:10px;text-transform:uppercase;letter-spacing:.05em;">Included during trial</div>
            <div class="feat">✅ Add &amp; manage employees (all roles)</div>
            <div class="feat">✅ Attendance &amp; leave tracking</div>
            <div class="feat">✅ Payroll with yellow PDF payslips</div>
            <div class="feat">✅ Departments &amp; designations</div>
            <div class="feat">✅ Support ticket system</div>
            <div class="feat">✅ Holiday calendar management</div>
          </div>

          <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/login" class="btn">
            Login to Dashboard →
          </a>

          <div class="warn">
            <strong>Trial Notice:</strong> After ${fmtDate(trialEnd)}, your access will pause.
            Contact your Shnoor administrator to extend or upgrade your subscription.
          </div>
        </div>
        <div class="foot">
          <p>This email was sent by Shnoor International. Welcome aboard!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from:    `"Shnoor Platform" <${process.env.EMAIL_USER}>`,
    to:      email,
    subject: `Welcome to Shnoor — Your 15-Day Free Trial Has Started!`,
    html,
  });
};

/* ─────────────────────────────────────────────────────────────
   sendPayslipEmail
   Sent when admin processes payroll for an employee.
───────────────────────────────────────────────────────────── */
const sendPayslipEmail = async ({
  name, email, companyName, employeeId,
  baseSalary, bonus, bonusReason,
  allowances, allowanceReason,
  deductions, deductionReason,
  tax, taxReason,
  netSalary, payDate, payPeriod, notes,
}) => {
  const rupee   = (n) => "&#8377;" + parseFloat(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
  const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  const earningRows = [
    { label: "Basic Salary", amount: baseSalary },
    bonus      > 0 ? { label: bonusReason     || "Bonus",       amount: bonus      } : null,
    allowances > 0 ? { label: allowanceReason || "Allowances",  amount: allowances } : null,
  ].filter(Boolean);

  const deductionRows = [
    deductions > 0 ? { label: deductionReason || "Deductions",  amount: deductions } : null,
    tax        > 0 ? { label: taxReason       || "Tax / TDS",   amount: tax        } : null,
  ].filter(Boolean);

  const grossEarnings   = parseFloat(baseSalary || 0) + parseFloat(bonus || 0) + parseFloat(allowances || 0);
  const totalDeductions = parseFloat(deductions || 0) + parseFloat(tax || 0);

  const earningHtml = earningRows.map(r => `
    <tr>
      <td style="padding:8px 12px;font-size:13px;color:#374151;border-bottom:1px solid #f1f5f9;">${r.label}</td>
      <td style="padding:8px 12px;font-size:13px;color:#16a34a;font-weight:600;text-align:right;border-bottom:1px solid #f1f5f9;">${rupee(r.amount)}</td>
    </tr>`).join("");

  const deductionHtml = deductionRows.length
    ? deductionRows.map(r => `
    <tr>
      <td style="padding:8px 12px;font-size:13px;color:#374151;border-bottom:1px solid #f1f5f9;">${r.label}</td>
      <td style="padding:8px 12px;font-size:13px;color:#ef4444;font-weight:600;text-align:right;border-bottom:1px solid #f1f5f9;">&#8722; ${rupee(r.amount)}</td>
    </tr>`).join("")
    : `<tr><td colspan="2" style="padding:8px 12px;font-size:13px;color:#94a3b8;text-align:center;">No deductions</td></tr>`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8"/>
      <style>
        body { margin:0; padding:0; background:#f1f5f9; font-family:'Segoe UI',sans-serif; }
        .wrap { max-width:600px; margin:40px auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,.08); }
        .hdr  { background:linear-gradient(135deg,#d4a017,#f5c332); padding:28px 40px; text-align:center; }
        .hdr h1 { color:#fff; margin:0; font-size:22px; font-weight:700; text-shadow:0 1px 3px rgba(0,0,0,.2); }
        .hdr p  { color:rgba(255,255,255,.9); margin:5px 0 0; font-size:13px; }
        .body { padding:28px 36px; }
        .net-box { background:linear-gradient(135deg,#d4a017,#f5c332); border-radius:14px; padding:22px; text-align:center; margin:20px 0; }
        .net-label  { color:rgba(255,255,255,.85); font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; }
        .net-amount { color:#fff; font-size:36px; font-weight:800; letter-spacing:-1px; margin:4px 0 0; text-shadow:0 2px 6px rgba(0,0,0,.15); }
        .chip { display:inline-block; background:#f1f5f9; border-radius:8px; padding:6px 12px; font-size:12px; color:#475569; font-weight:600; margin:0 4px 8px 0; }
        .section-title { font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:.06em; margin:18px 0 8px; }
        table { width:100%; border-collapse:collapse; background:#f8fafc; border-radius:10px; overflow:hidden; }
        .totals-row td { padding:9px 12px; font-size:13px; font-weight:700; }
        .earn-total { background:#fefce8; }
        .ded-total  { background:#fff1f2; }
        .login-btn  { display:block; width:fit-content; margin:20px auto 0; background:linear-gradient(135deg,#d4a017,#f5c332); color:#fff; text-decoration:none; padding:11px 28px; border-radius:10px; font-size:14px; font-weight:700; text-align:center; }
        .foot { background:#f8fafc; padding:16px 36px; text-align:center; border-top:1px solid #f1f5f9; }
        .foot p { font-size:11px; color:#94a3b8; margin:0; }
        .notes-box { background:#fffbeb; border:1px solid #fde68a; border-radius:8px; padding:12px 16px; font-size:13px; color:#92400e; margin-top:16px; }
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="hdr">
          <h1>&#8377; Salary Payslip</h1>
          <p>${companyName} &mdash; ${fmtDate(payDate)}</p>
        </div>
        <div class="body">
          <p style="font-size:15px;font-weight:600;color:#1e293b;margin:0 0 6px;">Hello, ${name}!</p>
          <p style="font-size:13px;color:#64748b;margin:0 0 16px;">Your salary has been processed. Here is a detailed breakdown.</p>

          <div class="net-box">
            <div class="net-label">Net Salary Credited</div>
            <div class="net-amount">&#8377;${parseFloat(netSalary || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
          </div>

          <div>
            <span class="chip">&#128197; ${fmtDate(payDate)}</span>
            <span class="chip">&#127970; ${companyName}</span>
            <span class="chip">&#128100; EMP-${String(employeeId).padStart(4, "0")}</span>
            ${payPeriod ? `<span class="chip">&#128203; ${payPeriod}</span>` : ""}
          </div>

          <div class="section-title">&#128200; Earnings</div>
          <table>
            <tbody>
              ${earningHtml}
              <tr class="totals-row earn-total">
                <td>Gross Earnings</td>
                <td style="text-align:right;color:#a16207;">&#8377;${parseFloat(grossEarnings).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>

          <div class="section-title">&#128202; Deductions</div>
          <table>
            <tbody>
              ${deductionHtml}
              <tr class="totals-row ded-total">
                <td>Total Deductions</td>
                <td style="text-align:right;color:#ef4444;">&#8722; &#8377;${parseFloat(totalDeductions).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>

          ${notes ? `<div class="notes-box"><strong>Notes:</strong> ${notes}</div>` : ""}

          <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/employee/payroll" class="login-btn">
            View &amp; Download Full Payslip &#8594;
          </a>
        </div>
        <div class="foot">
          <p>This is an automated payroll notification from ${companyName} via Shnoor Platform.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from:    `"${companyName} Payroll" <${process.env.EMAIL_USER}>`,
    to:      email,
    subject: `Salary Payslip — ${fmtDate(payDate)} | ${companyName}`,
    html,
  });
};

module.exports = { sendWelcomeEmail, sendTrialEmail, sendPayslipEmail };