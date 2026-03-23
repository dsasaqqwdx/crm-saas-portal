
const express = require("express");
const router = express.Router();
const pool = require("../../config/db");
const auth = require("../../middleware/authMiddleware");

router.get("/", auth, async (req, res) => {
try {
const { id: user_id } = req.user;
const result = await pool.query(
`SELECT *, id as notification_id FROM notifications
WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
[user_id]
);
res.json({ success: true, data: result.rows });
} catch (err) {
console.error(err);
res.status(500).json({ success: false, message: "Server error" });
}
});

router.get("/unread-count", auth, async (req, res) => {
try {
const { id: user_id } = req.user;
const result = await pool.query(
`SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false`,
[user_id]
);
res.json({ success: true, count: parseInt(result.rows[0].count) });
} catch (err) {
console.error(err);
res.status(500).json({ success: false, message: "Server error" });
}
});

router.post("/", async (req, res) => {
try {
const { user_id, ticket_id, type, message } = req.body;
if (!user_id || !type || !message)
return res.status(400).json({ success: false, message: "Missing fields" });
const result = await pool.query(
`INSERT INTO notifications (user_id, ticket_id, type, message)
VALUES ($1, $2, $3, $4) RETURNING *, id as notification_id`,
[user_id, ticket_id || null, type, message]
);
res.status(201).json({ success: true, data: result.rows[0] });
} catch (err) {
console.error(err);
res.status(500).json({ success: false, message: "Server error" });
}
});

router.put("/mark-all-read", auth, async (req, res) => {
try {
const { id: user_id } = req.user;
await pool.query(
`UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false`,
[user_id]
);
res.json({ success: true });
} catch (err) {
console.error(err);
res.status(500).json({ success: false, message: "Server error" });
}
});

router.delete("/clear-all", auth, async (req, res) => {
try {
const { id: user_id } = req.user;
await pool.query(`DELETE FROM notifications WHERE user_id = $1`, [user_id]);
res.json({ success: true });
} catch (err) {
console.error(err);
res.status(500).json({ success: false, message: "Server error" });
}
});

router.put("/:id/read", auth, async (req, res) => {
try {
const { id: user_id } = req.user;
const { id } = req.params;
await pool.query(
`UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2`,
[id, user_id]
);
res.json({ success: true });
} catch (err) {
console.error(err);
res.status(500).json({ success: false, message: "Server error" });
}
});

module.exports = router;