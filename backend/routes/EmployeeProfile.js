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

router.get("/profile", auth, async (req, res) => {
try {
const userId = req.user.id;

const profileResult = await pool.query(
"select * from employee_profiles where employee_id=$1",
[userId]
);

if (profileResult.rows.length > 0) {
const p = profileResult.rows[0];

return res.json({
data: {
name: p.name,
email: p.email,
phone: p.phone,
department: p.department,
role: "Employee",
avatar: p.avatar_url
? `${req.protocol}://${req.get("host")}${p.avatar_url}`
: null,
joined_at: p.created_at
}
});
}
const userResult = await pool.query(
"select user_id, name, email, created_at from users where user_id=$1",
[userId]
);
const u = userResult.rows[0];
return res.json({
data: {
name: u.name,
email: u.email,
phone: null,
department: "General",
role: "Employee",
avatar: null,
joined_at: u.created_at
}
});
} catch (err) {
console.error("GET PROFILE ERROR:", err.message);
res.status(500).json({ message: "Server error" });
}
});
router.put("/profile", auth, upload.single("avatar"), async (req, res) => {
try {
console.log("FILE:", req.file);
const userId = req.user.id;
const { name, email, phone, department } = req.body;
let avatarUrl = null;
if (req.file) {
avatarUrl = `/uploads/employee_avatars/${req.file.filename}`;
}
const existing = await pool.query(
"select avatar_url from employee_profiles where employee_id=$1",
[userId]
);
if (existing.rows.length > 0) {
if (avatarUrl && existing.rows[0].avatar_url) {
const oldPath = path.join(__dirname, "..", existing.rows[0].avatar_url);
if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
}
if (avatarUrl) {
await pool.query(
`update employee_profiles set name=$1, email=$2, phone=$3, department=$4, avatar_url=$5 where employee_id=$6`,
[name, email, phone || null, department || "General", avatarUrl, userId]
);
} else {
await pool.query(
`update employee_profiles set name=$1, email=$2, phone=$3, department=$4 where employee_id=$5`,
[name, email, phone || null, department || "General", userId]
);
}
} else {
await pool.query(
`insert into employee_profiles (employee_id, name, email, phone, department, avatar_url) values ($1,$2,$3,$4,$5,$6)`,
[userId, name, email, phone || null, department || "General", avatarUrl]
);
}
await pool.query(
"update users set name=$1, email=$2 where user_id=$3",
[name, email, userId]
);
res.json({ message: "Profile updated successfully" });
} catch (err) {
console.error("UPDATE ERROR:", err.message);
res.status(500).json({ message: "Server error" });
}
});
router.delete("/avatar", auth, async (req, res) => {
try {
const userId = req.user.id;
const result = await pool.query(
"select avatar_url from employee_profiles where employee_id=$1",
[userId]
);
if (!result.rows.length || !result.rows[0].avatar_url) {
return res.status(404).json({ message: "No avatar" });
}
const filePath = path.join(__dirname, "..", result.rows[0].avatar_url);
if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
await pool.query(
"update employee_profiles set avatar_url=NULL where employee_id=$1",
[userId]
);
res.json({ message: "Deleted" });
} catch (err) {
res.status(500).json({ message: "Server error" });
}
});
module.exports = router;