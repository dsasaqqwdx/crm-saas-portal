// const express = require("express");
// const router = express.Router();
// const pool = require("../config/db");
// const auth = require("../middleware/authMiddleware");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const bcrypt = require("bcryptjs");

// // ── avatar upload setup ───────────────────────────────────────────────────────
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = path.join(__dirname, "../uploads/avatars");
//     if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `admin_${req.user.id}_${Date.now()}${ext}`);
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 3 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     if (!file.mimetype.startsWith("image/")) {
//       return cb(new Error("Only image files are allowed"));
//     }
//     cb(null, true);
//   },
// });

// // ── GET /api/admin/profile ────────────────────────────────────────────────────
// router.get("/profile", auth, async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // try admin_profiles first
//     const profileResult = await pool.query(
//       "SELECT * FROM admin_profiles WHERE admin_id = $1",
//       [userId]
//     );

//     if (profileResult.rows.length > 0) {
//       const p = profileResult.rows[0];
//       return res.json({
//         data: {
//           name:       p.name,
//           email:      p.email,
//           phone:      p.phone,
//           department: p.department,
//           role:       "Admin",
//           avatar:     p.avatar_url
//             ? `${req.protocol}://${req.get("host")}${p.avatar_url}`
//             : null,
//           joined_at:  p.created_at,
//         },
//       });
//     }

//     // fallback: pull from users table so page is never blank on first load
//     const userResult = await pool.query(
//       "SELECT user_id, name, email, created_at FROM users WHERE user_id = $1",
//       [userId]
//     );

//     if (userResult.rows.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const u = userResult.rows[0];
//     return res.json({
//       data: {
//         name:       u.name,
//         email:      u.email,
//         phone:      null,
//         department: "Administration",
//         role:       "Admin",
//         avatar:     null,
//         joined_at:  u.created_at,
//       },
//     });
//   } catch (err) {
//     console.error("GET /admin/profile error:", err.message);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ── PUT /api/admin/profile ────────────────────────────────────────────────────
// router.put("/profile", auth, upload.single("avatar"), async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { name, email, phone, department } = req.body;

//     if (!name || !email) {
//       return res.status(400).json({ message: "Name and email are required" });
//     }

//     let avatarUrl = null;
//     if (req.file) {
//       avatarUrl = `/uploads/avatars/${req.file.filename}`;
//     }

//     const existing = await pool.query(
//       "SELECT id, avatar_url FROM admin_profiles WHERE admin_id = $1",
//       [userId]
//     );

//     if (existing.rows.length > 0) {
//       // delete old avatar file from disk if replacing
//       if (avatarUrl && existing.rows[0].avatar_url) {
//         const oldPath = path.join(__dirname, "..", existing.rows[0].avatar_url);
//         if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
//       }

//       if (avatarUrl) {
//         await pool.query(
//           `UPDATE admin_profiles
//            SET name = $1, email = $2, phone = $3, department = $4, avatar_url = $5
//            WHERE admin_id = $6`,
//           [name, email, phone || null, department || "Administration", avatarUrl, userId]
//         );
//       } else {
//         await pool.query(
//           `UPDATE admin_profiles
//            SET name = $1, email = $2, phone = $3, department = $4
//            WHERE admin_id = $5`,
//           [name, email, phone || null, department || "Administration", userId]
//         );
//       }
//     } else {
//       // first save ever — insert fresh row
//       await pool.query(
//         `INSERT INTO admin_profiles (admin_id, name, email, phone, department, avatar_url)
//          VALUES ($1, $2, $3, $4, $5, $6)`,
//         [userId, name, email, phone || null, department || "Administration", avatarUrl]
//       );
//     }

//     // keep users table in sync
//     await pool.query(
//       "UPDATE users SET name = $1, email = $2 WHERE user_id = $3",
//       [name, email, userId]
//     );

//     return res.json({ message: "Profile updated successfully" });
//   } catch (err) {
//     console.error("PUT /admin/profile error:", err.message);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ── PUT /api/admin/change-password ────────────────────────────────────────────
// router.put("/change-password", auth, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { current_password, new_password } = req.body;

//     if (!current_password || !new_password) {
//       return res.status(400).json({ message: "Both fields are required" });
//     }
//     if (new_password.length < 6) {
//       return res.status(400).json({ message: "Password must be at least 6 characters" });
//     }

//     const result = await pool.query(
//       "SELECT password FROM users WHERE user_id = $1",
//       [userId]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const valid = await bcrypt.compare(current_password, result.rows[0].password);
//     if (!valid) {
//       return res.status(401).json({ message: "Current password is incorrect" });
//     }

//     const hashed = await bcrypt.hash(new_password, 10);
//     await pool.query(
//       "UPDATE users SET password = $1 WHERE user_id = $2",
//       [hashed, userId]
//     );

//     return res.json({ message: "Password updated successfully" });
//   } catch (err) {
//     console.error("PUT /admin/change-password error:", err.message);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");

// ── avatar upload setup ───────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/avatars");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `admin_${req.user.id}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

// ── GET /api/admin/profile ────────────────────────────────────────────────────
router.get("/profile", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const profileResult = await pool.query(
      "SELECT * FROM admin_profiles WHERE admin_id = $1",
      [userId]
    );

    if (profileResult.rows.length > 0) {
      const p = profileResult.rows[0];
      return res.json({
        data: {
          name:       p.name,
          email:      p.email,
          phone:      p.phone,
          department: p.department,
          role:       "Admin",
          avatar:     p.avatar_url
            ? `${req.protocol}://${req.get("host")}${p.avatar_url}`
            : null,
          joined_at:  p.created_at,
        },
      });
    }

    // fallback: pull from users table
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
        department: "Administration",
        role:       "Admin",
        avatar:     null,
        joined_at:  u.created_at,
      },
    });
  } catch (err) {
    console.error("GET /admin/profile error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ── PUT /api/admin/profile ────────────────────────────────────────────────────
router.put("/profile", auth, upload.single("avatar"), async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, department } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    let avatarUrl = null;
    if (req.file) {
      avatarUrl = `/uploads/avatars/${req.file.filename}`;
    }

    const existing = await pool.query(
      "SELECT id, avatar_url FROM admin_profiles WHERE admin_id = $1",
      [userId]
    );

    if (existing.rows.length > 0) {
      // Delete old avatar file from disk if a new one is being uploaded
      if (avatarUrl && existing.rows[0].avatar_url) {
        const oldPath = path.join(__dirname, "..", existing.rows[0].avatar_url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      if (avatarUrl) {
        await pool.query(
          `UPDATE admin_profiles
           SET name = $1, email = $2, phone = $3, department = $4, avatar_url = $5
           WHERE admin_id = $6`,
          [name, email, phone || null, department || "Administration", avatarUrl, userId]
        );
      } else {
        await pool.query(
          `UPDATE admin_profiles
           SET name = $1, email = $2, phone = $3, department = $4
           WHERE admin_id = $5`,
          [name, email, phone || null, department || "Administration", userId]
        );
      }
    } else {
      await pool.query(
        `INSERT INTO admin_profiles (admin_id, name, email, phone, department, avatar_url)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, name, email, phone || null, department || "Administration", avatarUrl]
      );
    }

    // Keep users table in sync
    await pool.query(
      "UPDATE users SET name = $1, email = $2 WHERE user_id = $3",
      [name, email, userId]
    );

    return res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("PUT /admin/profile error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ── DELETE /api/admin/avatar ──────────────────────────────────────────────────
router.delete("/avatar", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      "SELECT id, avatar_url FROM admin_profiles WHERE admin_id = $1",
      [userId]
    );

    if (result.rows.length === 0 || !result.rows[0].avatar_url) {
      return res.status(404).json({ message: "No avatar to delete" });
    }

    // Remove file from disk
    const filePath = path.join(__dirname, "..", result.rows[0].avatar_url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // Clear avatar_url in DB
    await pool.query(
      "UPDATE admin_profiles SET avatar_url = NULL WHERE admin_id = $1",
      [userId]
    );

    return res.json({ message: "Avatar deleted successfully" });
  } catch (err) {
    console.error("DELETE /admin/avatar error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ── PUT /api/admin/change-password ────────────────────────────────────────────
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

    if (result.rows.length === 0) {
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

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("PUT /admin/change-password error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;