
const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const auth = require("../middleware/authMiddleware");
router.post("/", auth, async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { ticket_id, message_key, action_type, value } = req.body;

    if (action_type === "reaction") {
      const existing = await pool.query(
        `SELECT * FROM message_actions WHERE ticket_id=$1 AND message_key=$2 AND user_id=$3 AND action_type='reaction'`,
        [ticket_id, message_key, user_id]
      );
      if (existing.rows.length > 0) {
        if (existing.rows[0].value === value) {
          await pool.query(`DELETE FROM message_actions WHERE action_id=$1`, [existing.rows[0].action_id]);
          return res.json({ success: true, removed: true });
        } else {
          await pool.query(`UPDATE message_actions SET value=$1 WHERE action_id=$2`, [value, existing.rows[0].action_id]);
          return res.json({ success: true, updated: true });
        }
      }
    }
    const result = await pool.query(
      `INSERT INTO message_actions (ticket_id, message_key, user_id, action_type, value) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [ticket_id, message_key, user_id, action_type, value]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});
router.get("/:ticket_id", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM message_actions WHERE ticket_id=$1 ORDER BY created_at ASC`,
      [req.params.ticket_id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;