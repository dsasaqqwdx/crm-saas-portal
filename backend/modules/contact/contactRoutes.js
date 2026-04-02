const express = require("express");
const router  = express.Router();
const pool    = require("../../config/db");

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message)
      return res.status(400).json({ success: false, msg: "All fields are required" });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ success: false, msg: "Invalid email address" });

    const result = await pool.query(
      `INSERT INTO contact_messages (name, email, message)
       VALUES ($1, $2, $3) RETURNING *`,
      [name.trim(), email.toLowerCase().trim(), message.trim()]
    );

    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Contact form error:", err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC"
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Contact fetch error:", err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM contact_messages WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ success: false, msg: "Message not found" });

    return res.json({ success: true, message: "Message deleted" });
  } catch (err) {
    console.error("Contact delete error:", err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
