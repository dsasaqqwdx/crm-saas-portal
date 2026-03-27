
const express  = require("express");
const router   = express.Router();
const pool     = require("../../config/db");
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const auth     = require("../../middleware/authMiddleware");
const { sendWelcomeEmail } = require("../../utils/emailHelper");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, company_id } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, msg: "Name, email and password are required" });

    const existing = await pool.query("SELECT user_id FROM users WHERE email = $1", [email.toLowerCase().trim()]);
    if (existing.rows.length)
      return res.status(400).json({ success: false, msg: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, company_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING user_id, name, email, role`,
      [name.trim(), email.toLowerCase().trim(), hashed, role || "employee", company_id || null]
    );

    const user = result.rows[0];

    if (role === "super_admin" || role === "software_owner") {
      sendWelcomeEmail({
        name:     name.trim(),
        email:    email.toLowerCase().trim(),
        password: password,
        role:     role,
      }).catch(err => console.error("Welcome email failed:", err.message));
    }

    return res.status(201).json({ success: true, data: user, message: "Account created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, msg: "Email and password are required" });

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email.toLowerCase().trim()]
    );

    if (!result.rows.length)
      return res.status(400).json({ success: false, msg: "Invalid credentials" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: user.role, company_id: user.company_id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
      user: { name: user.name, email: user.email, role: user.role, company_id: user.company_id },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT user_id, name, email, role, company_id FROM users WHERE user_id = $1",
      [req.user.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ success: false, msg: "User not found" });

    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
