
const express  = require("express");
const router   = express.Router();
const pool     = require("../../config/db");
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const auth     = require("../../middleware/authMiddleware");
const { sendWelcomeEmail } = require("../../utils/emailHelper");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, company_name } = req.body;

    if (!name || !email || !password || !company_name)
      return res.status(400).json({
        success: false,
        msg: "Name, email, password and company name are required",
      });

    if (password.length < 6)
      return res.status(400).json({
        success: false,
        msg: "Password must be at least 6 characters",
      });

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await pool.query(
      "SELECT user_id FROM users WHERE email = $1",
      [normalizedEmail]
    );
    if (existing.rows.length)
      return res.status(400).json({ success: false, msg: "Email already registered" });

  
    const comp = await pool.query(
      `INSERT INTO companies (company_name, is_trial, is_active, trial_start, trial_end)
       VALUES ($1, true, true, NOW(), NOW() + INTERVAL '15 days')
       RETURNING company_id, company_name`,
      [company_name.trim()]
    );
    const { company_id } = comp.rows[0];

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, company_id)
       VALUES ($1, $2, $3, 'company_admin', $4)
       RETURNING user_id, name, email, role, company_id`,
      [name.trim(), normalizedEmail, hashed, company_id]
    );

    const user = result.rows[0];

    sendWelcomeEmail({
      name:        name.trim(),
      email:       normalizedEmail,
      password,
      role:        "company_admin",
      companyName: company_name.trim(),
    }).catch(err => console.error("Welcome email failed:", err.message));

    return res.status(201).json({
      success: true,
      data:    user,
      message: "Account created. Your 15-day free trial has started.",
    });
  } catch (err) {
    console.error("Register error:", err);
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

    
    if (!user.is_active) {
      return res.status(403).json({
        success:    false,
        code:       "SUSPENDED",
        msg:        "Your account has been suspended by the administrator.",
        suspended_by: "superadmin",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: user.role, company_id: user.company_id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    let trialPayload = null;
    if (user.company_id) {
      const t = await pool.query(
        `SELECT
           c.is_trial,
           c.is_active,
           c.trial_start,
           COALESCE(u.trial_end, u.created_at + INTERVAL '15 days')   AS trial_end,
           GREATEST(0, CEIL(EXTRACT(EPOCH FROM (
             COALESCE(u.trial_end, u.created_at + INTERVAL '15 days') - NOW()
           )) / 86400))::int                                           AS days_left
         FROM companies c
         JOIN users u ON u.user_id = $1
         WHERE c.company_id = $2`,
        [user.user_id, user.company_id]
      );
      trialPayload = t.rows[0] || null;
    }

    return res.json({
      success: true,
      token,
      user: {
        name:       user.name,
        email:      user.email,
        role:       user.role,
        company_id: user.company_id,
      },
      trial: trialPayload,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT user_id, name, email, role, company_id, is_active FROM users WHERE user_id = $1",
      [req.user.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ success: false, msg: "User not found" });

    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Me error:", err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;