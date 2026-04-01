const nodemailer = require("nodemailer");
const db = require("../config/db");
const transporter = nodemailer.createTransport({
host: process.env.MAIL_HOST || "smtp.gmail.com",
port: Number(process.env.MAIL_PORT) || 587,
secure: false,
auth: {
user: process.env.MAIL_USER,
pass: process.env.MAIL_PASS,
},
});
const typeColors = {
general:          { label: "General",          color: "#f59e0b", bg: "#fffbeb" },
performance:      { label: "Performance",       color: "#6366f1", bg: "#f5f3ff" },
teamwork:         { label: "Teamwork",          color: "#10b981", bg: "#f0fdf4" },
innovation:       { label: "Innovation",        color: "#3b82f6", bg: "#eff6ff" },
leadership:       { label: "Leadership",        color: "#8b5cf6", bg: "#f5f3ff" },
customer_service: { label: "Customer Service",  color: "#ec4899", bg: "#fdf2f8" },
};

const buildHTML = (employeeName, employeeEmail, title, message, type) => {
const c = typeColors[type] || typeColors.general;
const today = new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"long", year:"numeric" });
const ref = "SHNOOR/APR/" + Date.now().toString().slice(-6);
const firstName = String(employeeName || "Employee").split(" ")[0];

return "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"/></head><body style=\"margin:0;padding:32px;background:#f8fafc;font-family:Arial,sans-serif;\">"
+ "<div style=\"max-width:640px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);\">"
+ "<div style=\"height:8px;background:" + c.color + ";\"></div>"
+ "<div style=\"padding:40px 48px;\">"
+ "<div style=\"margin-bottom:32px;\">"
+ "<div style=\"font-size:22px;font-weight:900;color:" + c.color + ";\">SHNOOR INTERNATIONAL LLC</div>"
+ "<div style=\"font-size:12px;color:#94a3b8;margin-top:4px;\">Plot 12, Sector 44, Gurugram, Delhi NCR | hr@shnoor.com</div>"
+ "<div style=\"margin-top:8px;font-size:12px;color:#64748b;\">Date: " + today + " | Ref: " + ref + "</div>"
+ "</div>"
+ "<div style=\"border-top:1px solid #f1f5f9;padding-top:20px;margin-bottom:20px;font-size:14px;color:#334155;line-height:1.8;\">"
+ "<strong>To,</strong><br/><strong>" + String(employeeName || "Employee") + "</strong><br/>" + String(employeeEmail || "")
+ "</div>"
+ "<div style=\"font-size:15px;font-weight:700;color:#0f172a;margin-bottom:24px;\">Sub: Letter of Appreciation - " + String(title || "") + "</div>"
+ "<p style=\"font-size:14px;color:#334155;line-height:1.8;\">Dear <strong>" + firstName + "</strong>,</p>"
+ "<p style=\"font-size:14px;color:#334155;line-height:1.8;\">We are pleased to present you this <strong>Letter of Appreciation</strong> in recognition of your outstanding contribution and dedication to <strong>SHNOOR INTERNATIONAL LLC</strong>.</p>"
+ "<div style=\"background:" + c.bg + ";border-left:5px solid " + c.color + ";border-radius:0 12px 12px 0;padding:20px 24px;margin:28px 0;\">"
+ "<div style=\"font-size:16px;font-weight:800;color:" + c.color + ";margin-bottom:6px;\">&#x1F3C6; " + String(title || "") + "</div>"
+ "<div style=\"font-size:13px;color:#334155;\">Category: <strong>" + c.label + "</strong></div>"
+ "</div>"
+ "<p style=\"font-size:14px;color:#334155;line-height:1.8;\">" + String(message || "") + "</p>"
+ "<p style=\"font-size:14px;color:#334155;line-height:1.8;\">Your efforts reflect the values and standards that make our organisation thrive. We are truly grateful to have you as a part of our team.</p>"
+ "<p style=\"font-size:14px;color:#334155;line-height:1.8;\">Keep up the exceptional work!</p>"
+ "<div style=\"margin-top:48px;padding-top:24px;border-top:1px solid #f1f5f9;\">"
+ "<div style=\"font-size:14px;font-weight:700;color:#0f172a;\">Authorised Signatory</div>"
+ "<div style=\"font-size:12px;color:#64748b;margin-top:4px;\">HR Department, SHNOOR INTERNATIONAL LLC</div>"
+ "</div></div>"
+ "<div style=\"height:6px;background:" + c.color + ";opacity:0.3;\"></div>"
+ "</div></body></html>";
};

const query = (sql, params) => new Promise((resolve, reject) => {
db.query(sql, params, (err, result) => {
if (err) reject(err);
else resolve(result.rows);
});
});
const sendAppreciation = async (req, res) => {
  try {
    const { toEmail, subject, message, appreciationType, htmlContent } = req.body;

    if (!toEmail || !subject || !message) {
      return res.status(400).json({ error: "toEmail, subject and message are required" });
    }

    const empRows = await query(
      "SELECT employee_id, name, company_id FROM employees WHERE email = $1 LIMIT 1",
      [toEmail]
    );

    if (empRows.length === 0) {
      return res.status(400).json({ error: "Employee not found" });
    }

    const employeeId  = empRows[0].employee_id;
    const employeeName = empRows[0].name;
    const companyId   = empRows[0].company_id;

    if (!companyId) {
      return res.status(400).json({ error: "Employee has no company_id set" });
    }

    const type = appreciationType || "general";
    const finalHtml = htmlContent
      ? htmlContent
      : buildHTML(employeeName, toEmail, subject, message, type);

    let dbData = null;
    try {
      const rows = await query(
        `INSERT INTO appreciations
          (employee_id, company_id, given_by, employee_email, employee_name,
           title, message, appreciation_type, html_content, status, sent_at, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'sent',NOW(),NOW()) RETURNING *`,
        [employeeId, companyId, req.user?.id || null, toEmail, employeeName,
         subject, message, type, finalHtml]
      );
      dbData = rows[0];
    } catch (e) {
      console.error("DB INSERT FAILED:", e.message);
      return res.status(500).json({ error: "Database insert failed", detail: e.message });
    }

    let emailSent = false;
    try {
      await transporter.sendMail({
        from:    `"HR Team" <${process.env.MAIL_USER}>`,
        to:      toEmail,
        subject: "Appreciation: " + subject,
        html:    finalHtml,  
      });
      emailSent = true;
    } catch (e) {
      console.error("email failed:", e.message);
    }

    return res.status(200).json({
      success: true,
      message: emailSent ? "Appreciation sent successfully" : "Saved but email failed",
      emailSent,
      dbSaved: true,
      data: dbData,
    });

  } catch (err) {
    console.error("sendAppreciation unhandled:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getMyAppreciations = async (req, res) => {
try {
const employeeEmail = req.user?.email;
const employeeId = req.user?.id;

if (!employeeEmail && !employeeId) {
return res.status(401).json({ success: false, message: "User not authenticated" });
}
let sql = `SELECT appreciation_id AS id, employee_id, employee_name, employee_email,
title, message, appreciation_type, html_content, status, created_at, sent_at
FROM appreciations WHERE employee_email = $1`;
const params = [employeeEmail];

sql += " ORDER BY COALESCE(sent_at, created_at) DESC";

const rows = await query(sql, params);

const result = rows.map(item => ({
...item,
appreciation_type: item.appreciation_type || "general",
html_content: item.html_content || buildHTML(
item.employee_name || "Employee",
item.employee_email || "",
item.title,
item.message,
item.appreciation_type || "general"
),
}));

return res.json({ success: true, data: result, count: result.length });
} catch (err) {
console.error("getMyAppreciations:", err);
return res.status(500).json({ success: false, error: err.message });
}
};

const getHistory = async (req, res) => {
try {
const rows = await query(
`SELECT appreciation_id AS id, employee_id, employee_name, employee_email,
title, message, appreciation_type, html_content, status, created_at, sent_at
FROM appreciations ORDER BY created_at DESC`,
[]
);
return res.json({ success: true, data: rows });
} catch (err) {
console.error("getHistory:", err);
return res.status(500).json({ success: false, error: err.message });
}
};

const saveDraft = async (req, res) => {
try {
const { employeeId, employeeEmail, employeeName, title, message, appreciationType } = req.body;
if (!employeeId || !title) {
return res.status(400).json({ message: "employeeId and title are required" });
}
const empRows = await query(
"SELECT company_id FROM employees WHERE employee_id = $1 LIMIT 1",
[employeeId]
);
const companyId = empRows[0]?.company_id || null;

if (!companyId) {
return res.status(400).json({ error: "Could not resolve company_id for this employee" });
}

const type = appreciationType || "general";
const htmlContent = buildHTML(employeeName || "Employee", employeeEmail || "", title, message || "", type);

const rows = await query(
`INSERT INTO appreciations
(employee_id, company_id, given_by, employee_email, employee_name, title, message, appreciation_type, html_content, status, created_at)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'draft', NOW()) RETURNING *`,
[employeeId, companyId, req.user?.id || null, employeeEmail || "", employeeName || "", title, message || "", type, htmlContent]
);

return res.status(201).json({ success: true, message: "Draft saved", data: rows[0] });
} catch (err) {
console.error("saveDraft:", err);
return res.status(500).json({ error: err.message, detail: err.detail });
}
};

const getAppreciationById = async (req, res) => {
try {
const rows = await query(
"SELECT * FROM appreciations WHERE appreciation_id = $1",
[req.params.id]
);
if (!rows.length) return res.status(404).json({ message: "Not found" });
return res.json({ success: true, data: rows[0] });
} catch (err) {
return res.status(500).json({ error: err.message });
}
};

const updateAppreciation = async (req, res) => {
try {
const { id } = req.params;
const { title, message, appreciationType } = req.body;
const existing = await query(
"SELECT employee_name, employee_email FROM appreciations WHERE appreciation_id = $1",
[id]
);
const emp = existing[0] || {};
const type = appreciationType || "general";
const htmlContent = buildHTML(emp.employee_name || "Employee", emp.employee_email || "", title, message, type);

const rows = await query(
`UPDATE appreciations SET title=$1, message=$2, appreciation_type=$3, html_content=$4, updated_at=NOW()
WHERE appreciation_id=$5 RETURNING appreciation_id AS id`,
[title, message, type, htmlContent, id]
);
if (!rows.length) return res.status(404).json({ message: "Not found" });
return res.json({ success: true, data: rows[0] });
} catch (err) {
return res.status(500).json({ error: err.message });
}
};

const debugTable = async (req, res) => {
try {
const columns = await query(
`SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns WHERE table_name = 'appreciations' ORDER BY ordinal_position`,
[]
);
const sample = await query("SELECT * FROM appreciations LIMIT 3", []);
const testHtml = buildHTML("Test User", "test@test.com", "Test Title", "Test message", "general");
return res.json({
success: true,
columns,
sample_data: sample,
html_build_test: { works: testHtml.length > 100, length: testHtml.length },
user: req.user,
});
} catch (err) {
return res.status(500).json({ error: err.message });
}
};

module.exports = {
sendAppreciation,
saveDraft,
getHistory,
getAppreciationById,
updateAppreciation,
getMyAppreciations,
debugTable,
};