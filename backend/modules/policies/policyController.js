const { createNotification, getCompanyAdmins } = require("../notifications/notificationHelper");
const db = require("../../config/db");
const fs = require("fs");
const path = require("path");
exports.uploadPolicy = async (req, res) => {
try {
const { title } = req.body;
if (!title) return res.status(400).json({ message: "Title is required" });
if (!req.file) return res.status(400).json({ message: "File is required" });
const fileName = req.file.filename;
const result = await db.query(
"INSERT INTO policies (title, file) VALUES ($1, $2) RETURNING *",
[title, fileName]
);

const company_id = req.user.company_id;

const adminIds = await getCompanyAdmins(company_id);
for (let id of adminIds) {
await createNotification(id, "policy", `📎 New policy attached: ${title}`);
}

const employees = await db.query(
"SELECT user_id FROM users WHERE company_id = $1 AND role = 'employee'",
[company_id]
);

for (let emp of employees.rows) {
await createNotification(emp.user_id, "policy", `New policy updated: ${title}`);
}

res.json({
message: "Policy uploaded successfully",
data: result.rows[0]
}
);

} catch (err) {
console.log("SERVER ERROR:", err);
res.status(500).json({ message: err.message });
}
};
exports.getPolicies = (req, res) => {
 db.query("SELECT * FROM policies ORDER BY id DESC", (err, result) => {
if (err) return res.status(500).json({ message: err.message });
res.json(result.rows);
});
};
exports.deletePolicy = (req, res) => {
const { id } = req.params;

if (!id) return res.status(400).json({ message: "Policy ID required" });
     db.query("SELECT file FROM policies WHERE id=$1", [id], (err, result) => {
if (err) return res.status(500).json({ message: err.message });
if (!result.rows.length) return res.status(404).json({ message: "Policy not found" });

    const filePath = path.join(__dirname, "../../uploads/policies", result.rows[0].file);

if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

db.query("DELETE FROM policies WHERE id=$1", [id], (err2) => {
if (err2) return res.status(500).json({ message: err2.message });
res.json({ message: "Policy deleted successfully" });
  });
    });
  };