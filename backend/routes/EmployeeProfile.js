
const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/employee_avatars");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `employee_${req.user.id}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  }
});

// ─────────────────────────────────────────────────────────────────
// GET /api/employees/profile
// Works for:
//   - pure employees  → looks up employee_profiles by user_id
//   - company_admin in "Self" mode → same lookup, but if not found
//     falls back to admin_profiles so the admin sees their own data
// ─────────────────────────────────────────────────────────────────
router.get("/profile", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Try employee_profiles first (works for both employee and admin-as-employee)
    const empResult = await pool.query(
      "SELECT * FROM employee_profiles WHERE employee_id = $1",
      [userId]
    );

    if (empResult.rows.length > 0) {
      const p = empResult.rows[0];
      return res.json({
        data: {
          name:       p.name,
          email:      p.email,
          phone:      p.phone,
          department: p.department,
          role:       "Employee",
          avatar:     p.avatar_url
            ? `${req.protocol}://${req.get("host")}${p.avatar_url}`
            : null,
          joined_at:  p.created_at,
          source:     "employee_profiles",
        }
      });
    }

    // 2. Not found in employee_profiles — check if this user is an admin
    //    and fall back to admin_profiles so "Self" view works for admins
    const adminResult = await pool.query(
      "SELECT * FROM admin_profiles WHERE admin_id = $1",
      [userId]
    );

    if (adminResult.rows.length > 0) {
      const p = adminResult.rows[0];
      return res.json({
        data: {
          name:       p.name,
          email:      p.email,
          phone:      p.phone,
          department: p.department || "Administration",
          role:       "Admin (Self View)",
          avatar:     p.avatar_url
            ? `${req.protocol}://${req.get("host")}${p.avatar_url}`
            : null,
          joined_at:  p.created_at,
          source:     "admin_profiles",
        }
      });
    }

    // 3. Last resort — pull basic info from users table
    const userResult = await pool.query(
      "SELECT user_id, name, email, created_at FROM users WHERE user_id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const u = userResult.rows[0];
    return res.json({
      data: {
        name:       u.name,
        email:      u.email,
        phone:      null,
        department: "General",
        role:       "Employee",
        avatar:     null,
        joined_at:  u.created_at,
        source:     "users",
      }
    });

  } catch (err) {
    console.error("GET /employees/profile ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────────────
// PUT /api/employees/profile
// Updates employee_profiles if record exists, otherwise inserts.
// If the user only has an admin_profiles record (admin in Self mode),
// it creates a new employee_profiles row for them.
// ─────────────────────────────────────────────────────────────────
router.put("/profile", auth, upload.single("avatar"), async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, department } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    let avatarUrl = null;
    if (req.file) {
      avatarUrl = `/uploads/employee_avatars/${req.file.filename}`;
    }

    const existing = await pool.query(
      "SELECT avatar_url FROM employee_profiles WHERE employee_id = $1",
      [userId]
    );

    if (existing.rows.length > 0) {
      // Record exists — update it
      if (avatarUrl && existing.rows[0].avatar_url) {
        const oldPath = path.join(__dirname, "..", existing.rows[0].avatar_url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      if (avatarUrl) {
        await pool.query(
          `UPDATE employee_profiles
           SET name=$1, email=$2, phone=$3, department=$4, avatar_url=$5
           WHERE employee_id=$6`,
          [name, email, phone || null, department || "General", avatarUrl, userId]
        );
      } else {
        await pool.query(
          `UPDATE employee_profiles
           SET name=$1, email=$2, phone=$3, department=$4
           WHERE employee_id=$5`,
          [name, email, phone || null, department || "General", userId]
        );
      }
    } else {
      // No employee_profiles record — create one
      // (this also covers admin-in-self-mode creating their employee profile)
      await pool.query(
        `INSERT INTO employee_profiles (employee_id, name, email, phone, department, avatar_url)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, name, email, phone || null, department || "General", avatarUrl]
      );
    }

    // Sync name/email back to users table
    await pool.query(
      "UPDATE users SET name=$1, email=$2 WHERE user_id=$3",
      [name, email, userId]
    );

    res.json({ message: "Profile updated successfully" });

  } catch (err) {
    console.error("PUT /employees/profile ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────────────
// DELETE /api/employees/avatar
// ─────────────────────────────────────────────────────────────────
router.delete("/avatar", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      "SELECT avatar_url FROM employee_profiles WHERE employee_id = $1",
      [userId]
    );

    if (!result.rows.length || !result.rows[0].avatar_url) {
      return res.status(404).json({ message: "No avatar to remove" });
    }

    const filePath = path.join(__dirname, "..", result.rows[0].avatar_url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await pool.query(
      "UPDATE employee_profiles SET avatar_url = NULL WHERE employee_id = $1",
      [userId]
    );

    res.json({ message: "Avatar removed successfully" });

  } catch (err) {
    console.error("DELETE /employees/avatar ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────────────
// PUT /api/employees/change-password
// ─────────────────────────────────────────────────────────────────
router.put("/change-password", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ message: "Both fields are required" });
    }
    if (new_password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const result = await pool.query(
      "SELECT password FROM users WHERE user_id = $1",
      [userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const valid = await bcrypt.compare(current_password, result.rows[0].password);
    if (!valid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashed = await bcrypt.hash(new_password, 10);
    await pool.query(
      "UPDATE users SET password = $1 WHERE user_id = $2",
      [hashed, userId]
    );

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("PUT /employees/change-password ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;