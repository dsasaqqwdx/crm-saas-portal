const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const verifyToken = require("../../middleware/authMiddleware");
const { createNotification, getCompanyAdmins, getSuperAdmins } = require("../notifications/notificationHelper");

const adminRoles = ["company_admin", "super_admin", "software_owner"];

async function broadcastToAdmins(companyId, userId, type, message, ticketId) {
  const companyAdmins = await getCompanyAdmins(companyId);
  const superAdmins   = await getSuperAdmins();
  const uniqueAdmins  = [...new Set([...companyAdmins, ...superAdmins])];
  for (const adminId of uniqueAdmins) {
    if (adminId !== userId) {
      await createNotification(adminId, type, message, parseInt(ticketId));
    }
  }
}

router.get("/:ticketId", verifyToken, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { rows } = await db.query(
      `SELECT * FROM message_actions WHERE ticket_id = $1`,
      [ticketId]
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Fetch actions error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/reaction", verifyToken, async (req, res) => {
  try {
    const { id: userId, company_id: companyId, role } = req.user;
    const { ticket_id: ticketId, message_key: messageKey, emoji } = req.body;

    const { rows: existing } = await db.query(
      `SELECT * FROM message_actions
       WHERE ticket_id = $1 AND message_key = $2 AND user_id = $3
       AND action_type = 'reaction' AND value = $4`,
      [ticketId, messageKey, userId, emoji]
    );

    if (existing.length > 0) {
      await db.query(
        `DELETE FROM message_actions
         WHERE ticket_id = $1 AND message_key = $2 AND user_id = $3
         AND action_type = 'reaction' AND value = $4`,
        [ticketId, messageKey, userId, emoji]
      );
      return res.json({ success: true, toggled: "off" });
    }

    await db.query(
      `INSERT INTO message_actions (ticket_id, message_key, user_id, action_type, value)
       VALUES ($1, $2, $3, 'reaction', $4)
       ON CONFLICT (ticket_id, message_key, user_id, action_type) DO UPDATE SET value = $4`,
      [ticketId, messageKey, userId, emoji]
    );

    const reactorRow   = await db.query("SELECT name FROM users WHERE user_id = $1", [userId]);
    const reactorName  = reactorRow.rows[0]?.name ?? "Someone";
    const ticketRow    = await db.query("SELECT user_id FROM support_tickets WHERE ticket_id = $1", [ticketId]);
    const ticketOwner  = ticketRow.rows[0]?.user_id;
    const notifMessage = `${emoji} ${reactorName} reacted to a message`;

    if (adminRoles.includes(role)) {
      if (ticketOwner && ticketOwner !== userId) {
        await createNotification(ticketOwner, "reaction_added", notifMessage, parseInt(ticketId));
      }
    } else {
      await broadcastToAdmins(companyId, userId, "reaction_added", notifMessage, ticketId);
    }

    return res.json({ success: true, toggled: "on" });
  } catch (err) {
    console.error("Reaction error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/delete-for-me", verifyToken, async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { ticket_id: ticketId, message_key: messageKey } = req.body;

    await db.query(
      `INSERT INTO message_actions (ticket_id, message_key, user_id, action_type, value)
       VALUES ($1, $2, $3, 'delete_for_me', 'true')
       ON CONFLICT (ticket_id, message_key, user_id, action_type) DO NOTHING`,
      [ticketId, messageKey, userId]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("Delete for me error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/delete-for-everyone", verifyToken, async (req, res) => {
  try {
    const { id: userId, company_id: companyId, role } = req.user;
    const { ticket_id: ticketId, message_key: messageKey } = req.body;

    await db.query(
      `INSERT INTO message_actions (ticket_id, message_key, user_id, action_type, value)
       VALUES ($1, $2, $3, 'delete_for_everyone', 'true')
       ON CONFLICT (ticket_id, message_key, user_id, action_type) DO NOTHING`,
      [ticketId, messageKey, userId]
    );

    const deleterRow   = await db.query("SELECT name FROM users WHERE user_id = $1", [userId]);
    const deleterName  = deleterRow.rows[0]?.name ?? "Someone";
    const ticketRow    = await db.query("SELECT user_id FROM support_tickets WHERE ticket_id = $1", [ticketId]);
    const ticketOwner  = ticketRow.rows[0]?.user_id;
    const notifMessage = `🗑️ ${deleterName} deleted a message for everyone`;

    if (adminRoles.includes(role)) {
      if (ticketOwner && ticketOwner !== userId) {
        await createNotification(ticketOwner, "message_deleted", notifMessage, parseInt(ticketId));
      }
    } else {
      await broadcastToAdmins(companyId, userId, "message_deleted", notifMessage, ticketId);
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Delete for everyone error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;