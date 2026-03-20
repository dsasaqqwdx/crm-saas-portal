
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("../../config/db");
const auth = require("../../middleware/authMiddleware");
const { createNotification, getCompanyAdmins, getSuperAdmins } = require("../notifications/notificationHelper");
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf",
    "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/plain"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("File type not allowed"), false);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
router.post("/:ticket_id", auth, upload.single("file"), async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const { id: user_id, company_id, role } = req.user;
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    const file_url = `/uploads/${req.file.filename}`;
    const result = await pool.query(
      `INSERT INTO ticket_attachments (ticket_id, user_id, file_name, file_url, file_type, file_size)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [ticket_id, user_id, req.file.originalname, file_url, req.file.mimetype, req.file.size]
    );
    const userRes = await pool.query("SELECT name FROM users WHERE user_id = $1", [user_id]);
    const uploaderName = userRes.rows[0]?.name || "Someone";
    const isImage = req.file.mimetype.startsWith("image/");
    const fileLabel = isImage ? "image" : "file";
    const ticketRes = await pool.query("SELECT user_id FROM support_tickets WHERE ticket_id = $1", [ticket_id]);
    const ticketOwnerId = ticketRes.rows[0]?.user_id;
    if (role === "company_admin" || role === "super_admin" || role === "software_owner") {

      if (ticketOwnerId && ticketOwnerId !== user_id) {
        await createNotification(ticketOwnerId, "file_uploaded",
          ` ${uploaderName} uploaded a ${fileLabel}: "${req.file.originalname}"`, parseInt(ticket_id));
      }
    } else {
      const admins = await getCompanyAdmins(company_id);
      const superAdmins = await getSuperAdmins();
      const allAdmins = [...new Set([...admins, ...superAdmins])];
      for (const adminId of allAdmins) {
        await createNotification(adminId, "file_uploaded",
          `${uploaderName} uploaded a ${fileLabel}: "${req.file.originalname}"`, parseInt(ticket_id));
      }
    }
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
});
router.get("/:ticket_id", auth, async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const result = await pool.query(
      `SELECT a.*, u.name as uploader_name FROM ticket_attachments a
       LEFT JOIN users u ON a.user_id = u.user_id
       WHERE a.ticket_id = $1 ORDER BY a.uploaded_at ASC`,
      [ticket_id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.delete("/file/:attachment_id", auth, async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { attachment_id } = req.params;
    const existing = await pool.query("SELECT * FROM ticket_attachments WHERE attachment_id = $1", [attachment_id]);
    if (existing.rows.length === 0) return res.status(404).json({ success: false, message: "Not found" });
    if (existing.rows[0].user_id !== user_id) return res.status(403).json({ success: false, message: "Not authorized" });
    const filePath = path.join(__dirname, "../..", existing.rows[0].file_url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await pool.query("DELETE FROM ticket_attachments WHERE attachment_id = $1", [attachment_id]);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
