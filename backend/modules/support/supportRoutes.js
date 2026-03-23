const express = require("express");
const router = express.Router();
const pool = require("../../config/db");
const auth = require("../../middleware/authMiddleware");
const roleCheck = require("../../middleware/roleCheck");
const { createNotification, getCompanyAdmins, getSuperAdmins } = require("../notifications/notificationHelper");

const isAdmin = roleCheck(["company_admin", "super_admin", "software_owner"]);

const toArray = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return []; }
};

const toObject = (raw) => {
  if (!raw) return {};
  if (typeof raw === "object" && !Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return {}; }
};

async function notifyAdmins(companyId, type, message, ticketId) {
  const companyAdmins = await getCompanyAdmins(companyId);
  const superAdmins   = await getSuperAdmins();
  const uniqueAdmins  = [...new Set([...companyAdmins, ...superAdmins])];
  for (const adminId of uniqueAdmins) {
    await createNotification(adminId, type, message, ticketId);
  }
}

router.post("/", auth, async (req, res) => {
  try {
    const { id: userId, company_id: companyId } = req.user;
    const { subject, messages } = req.body;

    if (!subject)
      return res.status(400).json({ success: false, message: "Subject is required" });

    const { rows } = await pool.query(
      `INSERT INTO support_tickets (user_id, company_id, subject, messages, conversation, reactions)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, companyId, subject, JSON.stringify(messages || []), JSON.stringify([]), JSON.stringify({})]
    );

    const ticket   = rows[0];
    const userRow  = await pool.query("SELECT name FROM users WHERE user_id = $1", [userId]);
    const userName = userRow.rows[0]?.name ?? "An employee";

    await notifyAdmins(companyId, "new_ticket", `🎫 New ticket from ${userName}: "${subject}"`, ticket.ticket_id);

    return res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    console.error("Create ticket error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/:id/employee-message", auth, async (req, res) => {
  try {
    const { id: userId, company_id: companyId } = req.user;
    const ticketId    = req.params.id;
    const { message } = req.body;

    if (!message?.trim())
      return res.status(400).json({ success: false, message: "Message is required" });

    const userRow  = await pool.query("SELECT name FROM users WHERE user_id = $1", [userId]);
    const userName = userRow.rows[0]?.name ?? "Employee";

    const ticketRow = await pool.query("SELECT messages FROM support_tickets WHERE ticket_id = $1", [ticketId]);
    if (!ticketRow.rows.length)
      return res.status(404).json({ success: false, message: "Ticket not found" });

    const thread = toArray(ticketRow.rows[0].messages);
    thread.push({ role: "user", content: message.trim(), sender: userName, timestamp: new Date().toISOString() });

    await pool.query(
      "UPDATE support_tickets SET messages = $1, updated_at = NOW() WHERE ticket_id = $2",
      [JSON.stringify(thread), ticketId]
    );

    const preview = message.length > 60 ? message.substring(0, 60) + "..." : message;
    await notifyAdmins(companyId, "employee_message", `✉️ ${userName}: "${preview}"`, parseInt(ticketId));

    return res.json({ success: true });
  } catch (err) {
    console.error("Employee message error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/", auth, isAdmin, async (req, res) => {
  try {
    const { role, company_id: companyId } = req.user;
    const isSuperUser = role === "super_admin" || role === "software_owner";

    const base = `
      SELECT t.*, u.name AS user_name, u.email AS user_email,
             c.company_name, r.name AS replied_by_name
      FROM support_tickets t
      LEFT JOIN users     u ON t.user_id    = u.user_id
      LEFT JOIN companies c ON t.company_id = c.company_id
      LEFT JOIN users     r ON t.replied_by = r.user_id
    `;

    const { rows } = isSuperUser
      ? await pool.query(base + " ORDER BY t.created_at DESC")
      : await pool.query(base + " WHERE t.company_id = $1 ORDER BY t.created_at DESC", [companyId]);

    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Get tickets error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/count", auth, isAdmin, async (req, res) => {
  try {
    const { role, company_id: companyId } = req.user;
    const isSuperUser = role === "super_admin" || role === "software_owner";

    const { rows } = isSuperUser
      ? await pool.query("SELECT COUNT(*) FROM support_tickets WHERE status = 'open'")
      : await pool.query("SELECT COUNT(*) FROM support_tickets WHERE status = 'open' AND company_id = $1", [companyId]);

    return res.json({ success: true, count: parseInt(rows[0].count) });
  } catch (err) {
    console.error("Count error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/my", auth, async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { rows } = await pool.query(
      `SELECT t.*, r.name AS replied_by_name
       FROM support_tickets t
       LEFT JOIN users r ON t.replied_by = r.user_id
       WHERE t.user_id = $1
       ORDER BY t.created_at DESC`,
      [userId]
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("My tickets error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/:id/reply", auth, isAdmin, async (req, res) => {
  try {
    const { id: adminId } = req.user;
    const ticketId        = req.params.id;
    const { reply_text }  = req.body;

    if (!reply_text?.trim())
      return res.status(400).json({ success: false, message: "Reply cannot be empty" });

    const adminRow  = await pool.query("SELECT name FROM users WHERE user_id = $1", [adminId]);
    const adminName = adminRow.rows[0]?.name ?? "Admin";

    const ticketRow = await pool.query("SELECT * FROM support_tickets WHERE ticket_id = $1", [ticketId]);
    if (!ticketRow.rows.length)
      return res.status(404).json({ success: false, message: "Ticket not found" });

    const thread = toArray(ticketRow.rows[0].conversation);
    thread.push({ role: "admin", sender: adminName, content: reply_text.trim(), timestamp: new Date().toISOString() });

    const { rows } = await pool.query(
      `UPDATE support_tickets
       SET conversation = $1, admin_reply = $2,
           replied_at = NOW(), replied_by = $3,
           status = 'inprogress', updated_at = NOW()
       WHERE ticket_id = $4 RETURNING *`,
      [JSON.stringify(thread), reply_text.trim(), adminId, ticketId]
    );

    const preview = reply_text.trim().substring(0, 60) + (reply_text.length > 60 ? "..." : "");
    await createNotification(ticketRow.rows[0].user_id, "admin_reply", `💬 ${adminName} replied: "${preview}"`, parseInt(ticketId));

    return res.json({ success: true, data: rows[0], message: "Reply sent" });
  } catch (err) {
    console.error("Reply error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/:id/react", auth, async (req, res) => {
  try {
    const { id: userId }        = req.user;
    const ticketId              = req.params.id;
    const { messageKey, emoji } = req.body;

    if (!messageKey || !emoji)
      return res.status(400).json({ success: false, message: "messageKey and emoji are required" });

    const ALLOWED = ["👍", "👎", "❤️", "😂", "😮", "😢", "🔥", "✅"];
    if (!ALLOWED.includes(emoji))
      return res.status(400).json({ success: false, message: "Emoji not allowed" });

    const ticketRow = await pool.query("SELECT reactions FROM support_tickets WHERE ticket_id = $1", [ticketId]);
    if (!ticketRow.rows.length)
      return res.status(404).json({ success: false, message: "Ticket not found" });

    const reactions = toObject(ticketRow.rows[0].reactions);
    reactions[messageKey]        ??= {};
    reactions[messageKey][emoji] ??= [];

    const idx = reactions[messageKey][emoji].indexOf(userId);
    if (idx === -1) {
      reactions[messageKey][emoji].push(userId);
    } else {
      reactions[messageKey][emoji].splice(idx, 1);
      if (!reactions[messageKey][emoji].length)       delete reactions[messageKey][emoji];
      if (!Object.keys(reactions[messageKey]).length) delete reactions[messageKey];
    }

    await pool.query(
      "UPDATE support_tickets SET reactions = $1, updated_at = NOW() WHERE ticket_id = $2",
      [JSON.stringify(reactions), ticketId]
    );

    return res.json({ success: true, reactions });
  } catch (err) {
    console.error("React error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/:id/message", auth, async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const ticketId             = req.params.id;
    const { messageIndex, messageSource, scope } = req.body;

    if (messageIndex === undefined || !messageSource || !scope)
      return res.status(400).json({ success: false, message: "messageIndex, messageSource and scope are required" });

    const adminRoles = ["company_admin", "super_admin", "software_owner"];
    if (scope === "everyone" && !adminRoles.includes(role))
      return res.status(403).json({ success: false, message: "Only admins can delete for everyone" });

    const ticketRow = await pool.query("SELECT * FROM support_tickets WHERE ticket_id = $1", [ticketId]);
    if (!ticketRow.rows.length)
      return res.status(404).json({ success: false, message: "Ticket not found" });

    const ticket      = ticketRow.rows[0];
    let msgArray      = toArray(ticket.messages);
    let convArray     = toArray(ticket.conversation);
    let reactionMap   = toObject(ticket.reactions);
    const targetArray = messageSource === "conversation" ? convArray : msgArray;

    if (messageIndex < 0 || messageIndex >= targetArray.length)
      return res.status(400).json({ success: false, message: "Invalid message index" });

    if (scope === "everyone") {
      targetArray.splice(messageIndex, 1);
      const keyPrefix        = messageSource === "conversation" ? "conversation" : "messages";
      const updatedReactions = {};
      for (const [key, value] of Object.entries(reactionMap)) {
        if (!key.startsWith(keyPrefix + "-")) { updatedReactions[key] = value; continue; }
        const keyIndex = parseInt(key.split("-")[1]);
        if (keyIndex < messageIndex) updatedReactions[key] = value;
        if (keyIndex > messageIndex) updatedReactions[`${keyPrefix}-${keyIndex - 1}`] = value;
      }
      reactionMap = updatedReactions;
    } else {
      targetArray[messageIndex] = {
        ...targetArray[messageIndex],
        deletedFor: [...(targetArray[messageIndex].deletedFor ?? []), userId],
      };
    }

    const finalMessages     = messageSource === "messages"     ? JSON.stringify(targetArray) : JSON.stringify(msgArray);
    const finalConversation = messageSource === "conversation" ? JSON.stringify(targetArray) : JSON.stringify(convArray);

    await pool.query(
      "UPDATE support_tickets SET messages = $1, conversation = $2, reactions = $3, updated_at = NOW() WHERE ticket_id = $4",
      [finalMessages, finalConversation, JSON.stringify(reactionMap), ticketId]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("Delete message error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/:id/status", auth, isAdmin, async (req, res) => {
  try {
    const ticketId   = req.params.id;
    const { status } = req.body;

    const { rows } = await pool.query(
      "UPDATE support_tickets SET status = $1, updated_at = NOW() WHERE ticket_id = $2 RETURNING *",
      [status, ticketId]
    );

    if (!rows.length)
      return res.status(404).json({ success: false, message: "Ticket not found" });

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("Status update error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM support_tickets WHERE ticket_id = $1", [req.params.id]);
    return res.json({ success: true, message: "Ticket deleted" });
  } catch (err) {
    console.error("Delete ticket error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;