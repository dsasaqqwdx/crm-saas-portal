
const express = require("express");
const router = express.Router();
const pool = require("../../config/db");
const auth = require("../../middleware/authMiddleware");
const roleCheck = require("../../middleware/roleCheck"); const superOnly = roleCheck(["super_admin", "software_owner"]);
router.get("/", async (req, res) => {
try {
const result = await pool.query("SELECT * FROM website_settings ORDER BY section ASC");
const grouped = {};
for (const row of result.rows) {
if (!grouped[row.section]) grouped[row.section] = {};
grouped[row.section][row.key] = row.value;
}
return res.json({ success: true, data: grouped });
} catch (err) {
console.error(err);
return res.status(500).json({ success: false, message: "Server error" });
}
});

router.get("/:section", async (req, res) => {
try {
const { section } = req.params;
const result = await pool.query("SELECT key, value FROM website_settings WHERE section = $1", [section]);
const data = {};
for (const row of result.rows) data[row.key] = row.value;
return res.json({ success: true, data });
} catch (err) {
console.error(err);
return res.status(500).json({ success: false, message: "Server error" });
}
});

router.put("/:section", auth, superOnly, async (req, res) => {
try {
const { section } = req.params;
const fields = req.body;
for (const [key, value] of Object.entries(fields)) {
await pool.query(
`INSERT INTO website_settings (section, key, value) VALUES ($1, $2, $3)
ON CONFLICT (section, key) DO UPDATE SET value = $3, updated_at = NOW()`,
[section, key, String(value)]
);
}
return res.json({ success: true, message: "Settings saved" });
} catch (err) {
console.error(err);
return res.status(500).json({ success: false, message: "Server error" });
}
});

module.exports = router;