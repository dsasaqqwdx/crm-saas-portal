const nodemailer = require("nodemailer");
const db = require("../config/db");
const transporter = nodemailer.createTransport({
host:   process.env.MAIL_HOST || "smtp.gmail.com",
port:   Number(process.env.MAIL_PORT) || 587,
secure: false,
auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
const subjects = {
offer:      "Your Offer Letter — SHNOOR INTERNATIONAL LLC",
experience: "Experience Certificate — SHNOOR INTERNATIONAL LLC",
salary:     "Salary Slip — SHNOOR INTERNATIONAL LLC",
relieving:  "Relieving Letter — SHNOOR INTERNATIONAL LLC",
};
const wrapEmail = (html) => `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>
  body{margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif}
.shell{max-width:680px;margin:32px auto;background:#fff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden}
.body{padding:32px 40px}
.footer{padding:20px 40px;background:#f8fafc;border-top:1px solid #f1f5f9;font-size:12px;color:#94a3b8;text-align:center}
</style></head><body>
<div class="shell">
<div class="body">${html}</div>
<div class="footer">Official document from SHNOOR INTERNATIONAL LLC. Do not reply.</div>
</div></body></html>`;
const runQuery = (sql, params) =>
new Promise((resolve, reject) =>
    db.query(sql, params, (err, result) => {
if (err) return reject(err);
resolve(result.rows !== undefined ? result.rows : result);})
  );
const sendLetter = async (req, res) => {
  try {
const { employeeId, employeeEmail, employeeName, letterType, htmlContent, notes } = req.body;
if (!employeeId || !employeeEmail || !letterType || !htmlContent)
      return res.status(400).json({ success: false, message: "Missing required fields" });
    await transporter.sendMail({
from:    process.env.MAIL_FROM || `"SHNOOR INTERNATIONAL LLC" <${process.env.MAIL_USER}>`,
to:      employeeEmail,
subject: subjects[letterType] || "Letter from SHNOOR INTERNATIONAL LLC",
html:    wrapEmail(htmlContent),
    });
    const rows = await runQuery(
`insert into letters (employee_id, employee_name, employee_email, letter_type, html_content, notes, status, sent_at, created_by)
VALUES ($1, $2, $3, $4, $5, $6, 'sent', NOW(), $7) RETURNING id`,
[employeeId, employeeName, employeeEmail, letterType, htmlContent, notes || "", req.user?.id || null]
    ); return res.status(201).json({
success: true,
message: `Letter sent to ${employeeEmail}`,
data: { id: rows[0]?.id },});
  } catch (err) {console.error("sendLetter error:", err.message);return res.status(500).json({ success: false, message: err.message });
  }
};
const saveDraft = async (req, res) => {
  try {
    const { employeeId, employeeEmail, employeeName, letterType, htmlContent, notes } = req.body;
if (!employeeId || !letterType || !htmlContent)
return res.status(400).json({ success: false, message: "Missing required fields" });
const existing = await runQuery(
`select id FROM letters WHERE employee_id = $1 AND letter_type = $2 AND status = 'draft' LIMIT 1`,
[employeeId, letterType]
);if (existing.length > 0) {
await runQuery(
    `UPDATE letters SET html_content = $1, notes = $2, updated_at = NOW() WHERE id = $3`,
[htmlContent, notes || "", existing[0].id]
);
return res.json({ success: true, message: "Draft updated", data: { id: existing[0].id } });
    }const rows = await runQuery(
      `insert into letters (employee_id, employee_name, employee_email, letter_type, html_content, notes, status, created_by)
values ($1, $2, $3, $4, $5, $6, 'draft', $7) RETURNING id`,
      [employeeId, employeeName || "", employeeEmail || "", letterType, htmlContent, notes || "", req.user?.id || null]
    );
  return res.status(201).json({ success: true, message: "Draft saved", data: { id: rows[0]?.id } });
  } catch (err) {
    console.error("saveDraft error:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};
const getHistory = async (req, res) => {
  try {
const rows = await runQuery(`select* from letters ORDER BY created_at DESC`, []);return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("getHistory error:", err.message);
return res.status(500).json({ success: false, message: err.message });
  }
};
const getLetterById = async (req, res) => {
  try {
const rows = await runQuery(`SELECT * FROM letters WHERE id = $1 LIMIT 1`, [req.params.id]);
if (!rows.length) return res.status(404).json({ success: false, message: "Letter not found" });
return res.json({ success: true, data: rows[0] });
  } catch (err) {
return res.status(500).json({ success: false, message: err.message });
  }
};
const getMyLetters = async (req, res) => {
  try {
    const userEmail = req.user?.email;
    const userId    = req.user?.id || req.user?.employee_id;

    if (!userEmail && !userId)
      return res.status(400).json({ success: false, message: "User not identified" });

    const rows = await runQuery(
      `SELECT * FROM letters 
       WHERE (employee_email = $1 OR employee_id = $2) 
         AND status = 'sent' 
       ORDER BY created_at DESC`,
      [userEmail || "", String(userId || "")]
    );

    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("getMyLetters error:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};
module.exports = { sendLetter, saveDraft, getHistory, getLetterById, getMyLetters };