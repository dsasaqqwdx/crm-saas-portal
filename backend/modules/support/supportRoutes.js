const express = require("express");
const router = express.Router();
const pool = require("../../config/db");
const auth = require("../../middleware/authMiddleware");
const roleCheck = require("../../middleware/roleCheck");
const { createNotification, getCompanyAdmins, getSuperAdmins } = require("../notifications/notificationHelper");

const isAdmin = roleCheck(["company_admin", "super_admin", "software_owner"]);

function toArr(x) {
  if (!x) return [];
  if (Array.isArray(x)) return x;
  try { return JSON.parse(x); } catch(e) { return []; }
}
function toObj(x) {
  if (!x) return {};
  if (typeof x === "object" && !Array.isArray(x)) return x;
  try { return JSON.parse(x); } catch(e) { return {}; }
}

router.post("/", auth, async (req, res) => {
  try {
    const { id: uid, company_id } = req.user;
    const { subject, messages } = req.body;
    if (!subject) return res.status(400).json({ success: false, message: "Subject is required" });

    const r = await pool.query(
      `INSERT INTO support_tickets (user_id, company_id, subject, messages, conversation, reactions)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [uid, company_id, subject, JSON.stringify(messages || []), JSON.stringify([]), JSON.stringify({})]
    );
    const ticket = r.rows[0];

    const uRow = await pool.query("SELECT name FROM users WHERE user_id=$1", [uid]);
    const uname = uRow.rows[0]?.name || "An employee";

    const admins = await getCompanyAdmins(company_id);
    const superAdmins = await getSuperAdmins();
    const everyone = [...new Set([...admins, ...superAdmins])];
    for (const aid of everyone) {
      await createNotification(aid, "new_ticket", `🎫 New ticket from ${uname}: "${subject}"`, ticket.ticket_id);
    }

    res.status(201).json({ success: true, data: ticket });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/:id/employee-message", auth, async (req, res) => {
  try {
    const { id: uid, company_id } = req.user;
    const ticketId = req.params.id;
    const { message } = req.body;

    const uRow = await pool.query("SELECT name FROM users WHERE user_id=$1", [uid]);
    const uname = uRow.rows[0]?.name || "Employee";

    const admins = await getCompanyAdmins(company_id);
    const superAdmins = await getSuperAdmins();
    const everyone = [...new Set([...admins, ...superAdmins])];
    for (const aid of everyone) {
      await createNotification(aid, "employee_message",
        `✉️ ${uname}: "${message.substring(0, 60)}${message.length > 60 ? "..." : ""}"`, parseInt(ticketId));
    }

    res.json({ success: true });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/", auth, isAdmin, async (req, res) => {
  try {
    const { role, company_id } = req.user;
    let q, params;
    if (role === "super_admin" || role === "software_owner") {
      q = `SELECT t.*, u.name as user_name, u.email as user_email, c.company_name, r.name as replied_by_name
           FROM support_tickets t
           LEFT JOIN users u ON t.user_id = u.user_id
           LEFT JOIN companies c ON t.company_id = c.company_id
           LEFT JOIN users r ON t.replied_by = r.user_id
           ORDER BY t.created_at DESC`;
      params = [];
    } else {
      q = `SELECT t.*, u.name as user_name, u.email as user_email, c.company_name, r.name as replied_by_name
           FROM support_tickets t
           LEFT JOIN users u ON t.user_id = u.user_id
           LEFT JOIN companies c ON t.company_id = c.company_id
           LEFT JOIN users r ON t.replied_by = r.user_id
           WHERE t.company_id=$1
           ORDER BY t.created_at DESC`;
      params = [company_id];
    }
    const result = await pool.query(q, params);
    res.json({ success: true, data: result.rows });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/count", auth, isAdmin, async (req, res) => {
  try {
    const { role, company_id } = req.user;
    let result;
    if (role === "super_admin" || role === "software_owner") {
      result = await pool.query(`SELECT COUNT(*) FROM support_tickets WHERE status='open'`);
    } else {
      result = await pool.query(`SELECT COUNT(*) FROM support_tickets WHERE status='open' AND company_id=$1`, [company_id]);
    }
    res.json({ success: true, count: parseInt(result.rows[0].count) });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/my", auth, async (req, res) => {
  try {
    const { id: uid } = req.user;
    const result = await pool.query(
      `SELECT t.*, r.name as replied_by_name FROM support_tickets t
       LEFT JOIN users r ON t.replied_by = r.user_id
       WHERE t.user_id=$1 ORDER BY t.created_at DESC`,
      [uid]
    );
    res.json({ success: true, data: result.rows });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/:id/reply", auth, isAdmin, async (req, res) => {
  try {
    const { id: adminId } = req.user;
    const ticketId = req.params.id;
    const { reply_text } = req.body;
    if (!reply_text || !reply_text.trim()) return res.status(400).json({ success: false, message: "Reply cannot be empty" });

    const aRow = await pool.query("SELECT name FROM users WHERE user_id=$1", [adminId]);
    const senderName = aRow.rows[0]?.name || "Admin";

    const tRow = await pool.query("SELECT * FROM support_tickets WHERE ticket_id=$1", [ticketId]);
    if (!tRow.rows.length) return res.status(404).json({ success: false, message: "Ticket not found" });

    let conv = toArr(tRow.rows[0].conversation);
    conv.push({ role: "admin", sender: senderName, content: reply_text.trim(), timestamp: new Date().toISOString() });

    const updated = await pool.query(
      `UPDATE support_tickets SET conversation=$1, admin_reply=$2, replied_at=NOW(), replied_by=$3, status='inprogress', updated_at=NOW()
       WHERE ticket_id=$4 RETURNING *`,
      [JSON.stringify(conv), reply_text.trim(), adminId, ticketId]
    );

    const owner = tRow.rows[0].user_id;
    const preview = reply_text.trim().substring(0, 60) + (reply_text.length > 60 ? "..." : "");
    await createNotification(owner, "admin_reply", `💬 ${senderName} replied: "${preview}"`, parseInt(ticketId));

    res.json({ success: true, data: updated.rows[0] });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/:id/react", auth, async (req, res) => {
  try {
    const { id: uid } = req.user;
    const ticketId = req.params.id;
    const { messageKey, emoji } = req.body;

    if (!messageKey || !emoji) return res.status(400).json({ success: false, message: "Missing fields" });

    const allowed = ["👍","👎","❤️","😂","😮","😢","🔥","✅"];
    if (!allowed.includes(emoji)) return res.status(400).json({ success: false, message: "Invalid emoji" });

    const tRow = await pool.query("SELECT reactions FROM support_tickets WHERE ticket_id=$1", [ticketId]);
    if (!tRow.rows.length) return res.status(404).json({ success: false, message: "Not found" });

    const rxns = toObj(tRow.rows[0].reactions);
    if (!rxns[messageKey]) rxns[messageKey] = {};
    if (!rxns[messageKey][emoji]) rxns[messageKey][emoji] = [];

    const pos = rxns[messageKey][emoji].indexOf(uid);
    if (pos === -1) {
      rxns[messageKey][emoji].push(uid);
    } else {
      rxns[messageKey][emoji].splice(pos, 1);
      if (!rxns[messageKey][emoji].length) delete rxns[messageKey][emoji];
      if (!Object.keys(rxns[messageKey]).length) delete rxns[messageKey];
    }

    await pool.query(
      `UPDATE support_tickets SET reactions=$1, updated_at=NOW() WHERE ticket_id=$2`,
      [JSON.stringify(rxns), ticketId]
    );

    res.json({ success: true, reactions: rxns });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/:id/message", auth, async (req, res) => {
  try {
    const { id: uid, role } = req.user;
    const ticketId = req.params.id;
    const { messageIndex, messageSource, scope } = req.body;

    if (messageIndex === undefined || !messageSource || !scope)
      return res.status(400).json({ success: false, message: "Missing fields" });

    const adminRoles = ["company_admin","super_admin","software_owner"];
    if (scope === "everyone" && !adminRoles.includes(role))
      return res.status(403).json({ success: false, message: "No permission" });

    const tRow = await pool.query("SELECT * FROM support_tickets WHERE ticket_id=$1", [ticketId]);
    if (!tRow.rows.length) return res.status(404).json({ success: false, message: "Not found" });

    const ticket = tRow.rows[0];
    let msgs = toArr(ticket.messages);
    let conv = toArr(ticket.conversation);
    let rxns = toObj(ticket.reactions);

    const arr = messageSource === "conversation" ? conv : msgs;
    if (messageIndex < 0 || messageIndex >= arr.length)
      return res.status(400).json({ success: false, message: "Bad index" });

    if (scope === "everyone") {
      arr.splice(messageIndex, 1);
      const prefix = messageSource === "conversation" ? "conversation" : "messages";
      const newRxns = {};
      for (const [k, v] of Object.entries(rxns)) {
        if (k.startsWith(prefix + "-")) {
          const i = parseInt(k.split("-")[1]);
          if (i < messageIndex) newRxns[k] = v;
          else if (i > messageIndex) newRxns[`${prefix}-${i - 1}`] = v;
        } else {
          newRxns[k] = v;
        }
      }
      rxns = newRxns;
    } else {
      arr[messageIndex] = {
        ...arr[messageIndex],
        deletedFor: [...(arr[messageIndex].deletedFor || []), uid],
      };
    }

    const newMsgs = messageSource === "messages" ? JSON.stringify(arr) : JSON.stringify(msgs);
    const newConv = messageSource === "conversation" ? JSON.stringify(arr) : JSON.stringify(conv);

    await pool.query(
      `UPDATE support_tickets SET messages=$1, conversation=$2, reactions=$3, updated_at=NOW() WHERE ticket_id=$4`,
      [newMsgs, newConv, JSON.stringify(rxns), ticketId]
    );

    res.json({ success: true });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/:id/status", auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const r = await pool.query(
      `UPDATE support_tickets SET status=$1, updated_at=NOW() WHERE ticket_id=$2 RETURNING *`,
      [status, id]
    );
    if (!r.rows.length) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: r.rows[0] });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM support_tickets WHERE ticket_id=$1", [req.params.id]);
    res.json({ success: true, message: "Deleted" });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;