const express = require("express");
const router = express.Router();
const pool = require("../../config/db");
const auth = require("../../middleware/authMiddleware");
const { createNotification, getCompanyAdmins, getSuperAdmins } = require("../notifications/notificationHelper");


router.get("/:ticket_id", auth, async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const result = await pool.query(`SELECT * FROM message_actions WHERE ticket_id = $1`, [ticket_id]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.post("/reaction", auth, async (req, res) => {
  try {
    const { id: user_id, company_id, role } = req.user;
    const { ticket_id, message_key, emoji } = req.body;

    const existing = await pool.query(
      `SELECT * FROM message_actions WHERE ticket_id = $1 AND message_key = $2 AND user_id = $3 AND action_type = 'reaction' AND value = $4`,
      [ticket_id, message_key, user_id, emoji]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        `DELETE FROM message_actions WHERE ticket_id = $1 AND message_key = $2 AND user_id = $3 AND action_type = 'reaction' AND value = $4`,
        [ticket_id, message_key, user_id, emoji]
      );
      return res.json({ success: true, toggled: "off" });
    }

    await pool.query(
      `INSERT INTO message_actions (ticket_id, message_key, user_id, action_type, value)
       VALUES ($1, $2, $3, 'reaction', $4)
       ON CONFLICT (ticket_id, message_key, user_id, action_type) DO UPDATE SET value = $4`,
      [ticket_id, message_key, user_id, emoji]
    );

    
    const userRes = await pool.query("SELECT name FROM users WHERE user_id = $1", [user_id]);
    const reactorName = userRes.rows[0]?.name || "Someone";

   
    const ticketRes = await pool.query("SELECT user_id FROM support_tickets WHERE ticket_id = $1", [ticket_id]);
    const ticketOwnerId = ticketRes.rows[0]?.user_id;

    if (role === "company_admin" || role === "super_admin" || role === "software_owner") {
      
      if (ticketOwnerId && ticketOwnerId !== user_id) {
        await createNotification(ticketOwnerId, "reaction_added",
          `${emoji} ${reactorName} reacted to a message`, parseInt(ticket_id));
      }
    } else {
      
      const admins = await getCompanyAdmins(company_id);
      const superAdmins = await getSuperAdmins();
      const allAdmins = [...new Set([...admins, ...superAdmins])];
      for (const adminId of allAdmins) {
        if (adminId !== user_id) {
          await createNotification(adminId, "reaction_added",
            `${emoji} ${reactorName} reacted to a message`, parseInt(ticket_id));
        }
      }
    }

    res.json({ success: true, toggled: "on" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.post("/delete-for-me", auth, async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { ticket_id, message_key } = req.body;
    await pool.query(
      `INSERT INTO message_actions (ticket_id, message_key, user_id, action_type, value)
       VALUES ($1, $2, $3, 'delete_for_me', 'true')
       ON CONFLICT (ticket_id, message_key, user_id, action_type) DO NOTHING`,
      [ticket_id, message_key, user_id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.post("/delete-for-everyone", auth, async (req, res) => {
  try {
    const { id: user_id, company_id, role } = req.user;
    const { ticket_id, message_key } = req.body;
    await pool.query(
      `INSERT INTO message_actions (ticket_id, message_key, user_id, action_type, value)
       VALUES ($1, $2, $3, 'delete_for_everyone', 'true')
       ON CONFLICT (ticket_id, message_key, user_id, action_type) DO NOTHING`,
      [ticket_id, message_key, user_id]
    );

    
    const userRes = await pool.query("SELECT name FROM users WHERE user_id = $1", [user_id]);
    const deleterName = userRes.rows[0]?.name || "Someone";
    const ticketRes = await pool.query("SELECT user_id FROM support_tickets WHERE ticket_id = $1", [ticket_id]);
    const ticketOwnerId = ticketRes.rows[0]?.user_id;

    if (role === "company_admin" || role === "super_admin" || role === "software_owner") {
      if (ticketOwnerId && ticketOwnerId !== user_id) {
        await createNotification(ticketOwnerId, "message_deleted",
          `🗑️ ${deleterName} deleted a message for everyone`, parseInt(ticket_id));
      }
    } else {
      const admins = await getCompanyAdmins(company_id);
      const superAdmins = await getSuperAdmins();
      const allAdmins = [...new Set([...admins, ...superAdmins])];
      for (const adminId of allAdmins) {
        if (adminId !== user_id) {
          await createNotification(adminId, "message_deleted",
            `🗑️ ${deleterName} deleted a message for everyone`, parseInt(ticket_id));
        }
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
