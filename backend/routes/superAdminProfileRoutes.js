
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
    const dir = path.join(__dirname, "../uploads/avatars");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    
    cb(null, `super_tmp_${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/"))
      return cb(new Error("Only image files allowed"));
    cb(null, true);
  },
});

const resolveUserId = (req) => req.user?.user_id || req.user?.id || null;

router.get("/profile", auth, async (req, res) => {
  try {
    const userId = resolveUserId(req);
    if (!userId) return res.status(401).json({ message: "Invalid user token" });

    
    const userResult = await pool.query(
      `SELECT user_id, name, email, created_at
       FROM users
       WHERE user_id = $1`,
      [userId]
    );

    if (!userResult.rows.length)
      return res.status(404).json({ message: "User not found" });

    const u = userResult.rows[0];

    const profileResult = await pool.query(
      `SELECT phone, department, avatar_url, updated_at
       FROM super_admin_profiles
       WHERE user_id = $1`,
      [userId]
    );

    const p = profileResult.rows[0] || {};

    return res.json({
      data: {
        name:       u.name,                        
        email:      u.email,                       
        phone:      p.phone       || null,
        department: p.department  || "Super Administration",
        role:       "Super Admin",
        avatar:     p.avatar_url
          ? `${req.protocol}://${req.get("host")}${p.avatar_url}`
          : null,
        joined_at:  u.created_at,
      },
    });
  } catch (err) {
    console.error("GET super admin profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/profile", auth, upload.single("avatar"), async (req, res) => {
  let tempFilePath = req.file?.path || null;

  try {
    const userId = resolveUserId(req);
    if (!userId) return res.status(401).json({ message: "Invalid user token" });

    const { name, email, phone, department } = req.body;

    if (!name?.trim() || !email?.trim())
      return res.status(400).json({ message: "Name and email are required" });

    
    let avatarUrl = null;
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const newFilename = `super_${userId}_${Date.now()}${ext}`;
      const newPath = path.join(path.dirname(req.file.path), newFilename);
      fs.renameSync(req.file.path, newPath);
      tempFilePath = newPath;
      avatarUrl = `/uploads/avatars/${newFilename}`;
    }

   
    const existing = await pool.query(
      "SELECT profile_id, avatar_url FROM super_admin_profiles WHERE user_id = $1",
      [userId]
    );

    if (existing.rows.length > 0) {
     
      if (avatarUrl && existing.rows[0].avatar_url) {
        const oldPath = path.join(__dirname, "..", existing.rows[0].avatar_url);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch {}
        }
      }

      await pool.query(
        `UPDATE super_admin_profiles
         SET name        = $1,
             email       = $2,
             phone       = $3,
             department  = $4,
             avatar_url  = COALESCE($5, avatar_url),
             updated_at  = NOW()
         WHERE user_id   = $6`,
        [name, email, phone || null, department || "Super Administration", avatarUrl, userId]
      );
    } else {
      
      await pool.query(
        `INSERT INTO super_admin_profiles
           (user_id, name, email, phone, department, avatar_url, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [userId, name, email, phone || null, department || "Super Administration", avatarUrl]
      );
    }

    await pool.query(
      "UPDATE users SET name = $1, email = $2, updated_at = NOW() WHERE user_id = $3",
      [name, email, userId]
    );

    res.json({ message: "Super admin profile updated" });
  } catch (err) {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try { fs.unlinkSync(tempFilePath); } catch {}
    }
    console.error("PUT super admin profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/avatar", auth, async (req, res) => {
  try {
    const userId = resolveUserId(req);
    if (!userId) return res.status(401).json({ message: "Invalid user token" });

    const result = await pool.query(
      "SELECT avatar_url FROM super_admin_profiles WHERE user_id = $1",
      [userId]
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "Profile not found" });

    const { avatar_url } = result.rows[0];
    if (!avatar_url)
      return res.status(404).json({ message: "No avatar to remove" });

    const avatarPath = path.join(__dirname, "..", avatar_url);
    if (fs.existsSync(avatarPath)) {
      try { fs.unlinkSync(avatarPath); } catch {}
    }

    await pool.query(
      "UPDATE super_admin_profiles SET avatar_url = NULL, updated_at = NOW() WHERE user_id = $1",
      [userId]
    );

    res.json({ message: "Avatar removed" });
  } catch (err) {
    console.error("DELETE super admin avatar error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/change-password", auth, async (req, res) => {
  try {
    const userId = resolveUserId(req);
    if (!userId) return res.status(401).json({ message: "Invalid user token" });

    const { current_password, new_password } = req.body;

    if (!current_password || !new_password)
      return res.status(400).json({ message: "Both current and new password are required" });

    if (new_password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const result = await pool.query(
      "SELECT password FROM users WHERE user_id = $1",
      [userId]
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(current_password, result.rows[0].password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    const hashed = await bcrypt.hash(new_password, 10);
    await pool.query(
      "UPDATE users SET password = $1, updated_at = NOW() WHERE user_id = $2",
      [hashed, userId]
    );

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

