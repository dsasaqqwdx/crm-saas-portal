const express = require("express");
const router = express.Router();
const pool = require("../../config/db");
const auth = require("../../middleware/authMiddleware");
const roleCheck = require("../../middleware/roleCheck");
const { createNotification, getCompanyAdmins, getSuperAdmins } = require("../notifications/notificationHelper");
const isAdmin = roleCheck(["company_admin", "super_admin", "software_owner"]);
const parseArr = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return []; }
};
const parseObj = (raw) => {
  if (!raw) return {};
  if (typeof raw === "object" && !Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return {}; }
};
router.post("/", auth, async (req, res) => {
  try {
    const { id: user_id, company_id } = req.user;
    const { subject, messages } = req.body;
    if (!subject) return res.status(400).json({ success: false, message: "Subject is required" });

    const result = await pool.query(
      `INSERT INTO support_tickets (user_id, company_id, subject, messages, conversation, reactions)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, company_id, subject, JSON.stringify(messages || []), JSON.stringify([]), JSON.stringify({})]
    );
    const ticket = result.rows[0];
    const userRes = await pool.query("SELECT name FROM users WHERE user_id = $1", [user_id]);
    const userName = userRes.rows[0]?.name || "An employee";
 const admins = await getCompanyAdmins(company_id);
const superAdmins = await getSuperAdmins();
    const allAdmins = [...new Set([...admins, ...superAdmins])];
    for (const adminId of allAdmins) {
      await createNotification(adminId, "new_ticket",
        ` New support ticket from ${userName}: "${subject}"`, ticket.ticket_id);
    }
    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.post("/:id/employee-message", auth, async (req, res) => {
  try {
    const { id: user_id, company_id } = req.user;
    const { id } = req.params;
    const { message } = req.body;
const userRes = await pool.query("SELECT name FROM users WHERE user_id = $1", [user_id]);
    const userName = userRes.rows[0]?.name || "Employee";
const admins = await getCompanyAdmins(company_id);
    const superAdmins = await getSuperAdmins();
  const allAdmins = [...new Set([...admins, ...superAdmins])];
    for (const adminId of allAdmins) {
      await createNotification(
        adminId, "employee_message",
        `${userName}: "${message.substring(0, 60)}${message.length > 60 ? "..." : ""}"`,
        parseInt(id)
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});router.get("/", auth, isAdmin, async (req, res) => {
  try {
    const { role, company_id } = req.user;
    let query, params;
    if (role === "super_admin" || role === "software_owner") {
      query = `SELECT t.*, u.name as user_name, u.email as user_email, c.company_name, r.name as replied_by_name
               FROM support_tickets t LEFT JOIN users u ON t.user_id = u.user_id
               LEFT JOIN companies c ON t.company_id = c.company_id
               LEFT JOIN users r ON t.replied_by = r.user_id ORDER BY t.created_at DESC`;
      params = [];
    } else {
      query = `SELECT t.*, u.name as user_name, u.email as user_email, c.company_name, r.name as replied_by_name
               FROM support_tickets t LEFT JOIN users u ON t.user_id = u.user_id
               LEFT JOIN companies c ON t.company_id = c.company_id
               LEFT JOIN users r ON t.replied_by = r.user_id
               WHERE t.company_id = $1 ORDER BY t.created_at DESC`;
      params = [company_id];
    }
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});router.get("/count", auth, isAdmin, async (req, res) => {
  try {
    const { role, company_id } = req.user;
    let result;
    if (role === "super_admin" || role === "software_owner") {
      result = await pool.query(`SELECT COUNT(*) FROM support_tickets WHERE status = 'open'`);
    } else {
      result = await pool.query(`SELECT COUNT(*) FROM support_tickets WHERE status = 'open' AND company_id = $1`, [company_id]);
    }
    res.json({ success: true, count: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.get("/my", auth, async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const result = await pool.query(
      `SELECT t.*, r.name as replied_by_name FROM support_tickets t
       LEFT JOIN users r ON t.replied_by = r.user_id
       WHERE t.user_id = $1 ORDER BY t.created_at DESC`,
      [user_id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.post("/:id/reply", auth, isAdmin, async (req, res) => {
  try {
    const { id: admin_id } = req.user;
    const { id } = req.params;
    const { reply_text } = req.body;
    if (!reply_text || reply_text.trim() === "")
      return res.status(400).json({ success: false, message: "Reply cannot be empty" });

    const adminRes = await pool.query("SELECT name FROM users WHERE user_id = $1", [admin_id]);
    const senderName = adminRes.rows[0]?.name || "Admin";

    const ticketRes = await pool.query("SELECT * FROM support_tickets WHERE ticket_id = $1", [id]);
    if (ticketRes.rows.length === 0)
      return res.status(404).json({ success: false, message: "Ticket not found" });

    let conversation = parseArr(ticketRes.rows[0].conversation);
    conversation.push({ role: "admin", sender: senderName, content: reply_text.trim(), timestamp: new Date().toISOString() });

    const result = await pool.query(
      `UPDATE support_tickets SET conversation = $1, admin_reply = $2,
       replied_at = NOW(), replied_by = $3, status = 'inprogress', updated_at = NOW()
       WHERE ticket_id = $4 RETURNING *`,
      [JSON.stringify(conversation), reply_text.trim(), admin_id, id]
    );

    const ticketOwner = ticketRes.rows[0].user_id;
    const preview = reply_text.trim().substring(0, 60) + (reply_text.length > 60 ? "..." : "");
    await createNotification(ticketOwner, "admin_reply",
      `💬 ${senderName} replied: "${preview}"`, parseInt(id));

    res.json({ success: true, data: result.rows[0], message: "Reply sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.post("/:id/react", auth, async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { id } = req.params;
    const { messageKey, emoji } = req.body;
    if (!messageKey || !emoji)
      return res.status(400).json({ success: false, message: "messageKey and emoji are required" });
    const ALLOWED = ["👍", "👎", "❤️", "😂", "😮", "😢", "🔥", "✅"];
    if (!ALLOWED.includes(emoji))
      return res.status(400).json({ success: false, message: "Emoji not allowed" });
    const ticketRes = await pool.query("SELECT reactions FROM support_tickets WHERE ticket_id = $1", [id]);
    if (ticketRes.rows.length === 0)
      return res.status(404).json({ success: false, message: "Ticket not found" });
    const reactions = parseObj(ticketRes.rows[0].reactions);
    if (!reactions[messageKey]) reactions[messageKey] = {};
    if (!reactions[messageKey][emoji]) reactions[messageKey][emoji] = [];
    const idx = reactions[messageKey][emoji].indexOf(user_id);
    if (idx === -1) {
      reactions[messageKey][emoji].push(user_id);
    } else {
      reactions[messageKey][emoji].splice(idx, 1);
      if (reactions[messageKey][emoji].length === 0) delete reactions[messageKey][emoji];
      if (Object.keys(reactions[messageKey]).length === 0) delete reactions[messageKey];
    }

    await pool.query(
      `UPDATE support_tickets SET reactions = $1, updated_at = NOW() WHERE ticket_id = $2`,
      [JSON.stringify(reactions), id]
    );

    res.json({ success: true, reactions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.delete("/:id/message", auth, async (req, res) => {
  try {
    const { id: user_id, role } = req.user;
    const { id } = req.params;
    const { messageIndex, messageSource, scope } = req.body;

    if (messageIndex === undefined || !messageSource || !scope)
      return res.status(400).json({ success: false, message: "messageIndex, messageSource, and scope are required" });

    const adminRoles = ["company_admin", "super_admin", "software_owner"];
    if (scope === "everyone" && !adminRoles.includes(role))
      return res.status(403).json({ success: false, message: "Only admins can delete for everyone" });

    const ticketRes = await pool.query("SELECT * FROM support_tickets WHERE ticket_id = $1", [id]);
    if (ticketRes.rows.length === 0)
      return res.status(404).json({ success: false, message: "Ticket not found" });

    const ticket = ticketRes.rows[0];
    let messages     = parseArr(ticket.messages);
    let conversation = parseArr(ticket.conversation);
    let reactions    = parseObj(ticket.reactions);
    const targetArr  = messageSource === "conversation" ? conversation : messages;

    if (messageIndex < 0 || messageIndex >= targetArr.length)
      return res.status(400).json({ success: false, message: "Invalid message index" });

    if (scope === "everyone") {
      targetArr.splice(messageIndex, 1);
      const prefix = messageSource === "conversation" ? "conversation" : "messages";
      const newReactions = {};
      for (const [k, v] of Object.entries(reactions)) {
        if (k.startsWith(prefix + "-")) {
          const kIdx = parseInt(k.split("-")[1]);
          if (kIdx < messageIndex) newReactions[k] = v;
          else if (kIdx > messageIndex) newReactions[`${prefix}-${kIdx - 1}`] = v;
        } else {
          newReactions[k] = v;
        }
      }
      reactions = newReactions;
    } else {
      targetArr[messageIndex] = {
        ...targetArr[messageIndex],
        deletedFor: [...(targetArr[messageIndex].deletedFor || []), user_id],
      };
    }
    const updatedMessages     = messageSource === "messages"     ? JSON.stringify(targetArr) : JSON.stringify(messages);
    const updatedConversation = messageSource === "conversation" ? JSON.stringify(targetArr) : JSON.stringify(conversation);

    await pool.query(
      `UPDATE support_tickets SET messages = $1, conversation = $2, reactions = $3, updated_at = NOW() WHERE ticket_id = $4`,
      [updatedMessages, updatedConversation, JSON.stringify(reactions), id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.put("/:id/status", auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query(
      `UPDATE support_tickets SET status = $1, updated_at = NOW() WHERE ticket_id = $2 RETURNING *`,
      [status, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: "Ticket not found" });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM support_tickets WHERE ticket_id = $1", [id]);
    res.json({ success: true, message: "Ticket deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;