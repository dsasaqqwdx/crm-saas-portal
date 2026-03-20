const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const verifyToken = require("../../middleware/authMiddleware");

router.get("/", verifyToken, async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { rows } = await db.query(
      `SELECT *, id AS notification_id FROM notifications
       WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [userId]
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Fetch notifications error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/unread-count", verifyToken, async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { rows } = await db.query(
      SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false,
      [userId]
    );
    return res.json({ success: true, count: parseInt(rows[0].count) });
  } catch (err) {
    console.error("Unread count error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { user_id, ticket_id, type, message } = req.body;
    if (!user_id || !type || !message)
      return res.status(400).json({ success: false, message: "Missing required fields" });

    const { rows } = await db.query(
      `INSERT INTO notifications (user_id, ticket_id, type, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *, id AS notification_id`,
      [user_id, ticket_id ?? null, type, message]
    );
    return res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("Create notification error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/mark-all-read", verifyToken, async (req, res) => {
  try {
    const { id: userId } = req.user;
    await db.query(
      UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false,
      [userId]
    );
    return res.json({ success: true });
  } catch (err) {
    console.error("Mark all read error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/clear-all", verifyToken, async (req, res) => {
  try {
    const { id: userId } = req.user;
    await db.query(DELETE FROM notifications WHERE user_id = $1, [userId]);
    return res.json({ success: true });
  } catch (err) {
    console.error("Clear notifications error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/:id/read", verifyToken, async (req, res) => {
  try {
    const { id: userId } = req.user;
    const notifId = req.params.id;
    await db.query(
      UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2,
      [notifId, userId]
    );
    return res.json({ success: true });
  } catch (err) {
    console.error("Mark single read error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;