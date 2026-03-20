const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../../config/db");
const verifyToken = require("../../middleware/authMiddleware");
const { createNotification, getCompanyAdmins, getSuperAdmins } = require("../notifications/notificationHelper");

const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const allowedMimeTypes = [
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
];

const mimeFilter = (req, file, cb) => {
  allowedMimeTypes.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("File type not supported"), false);
};

const uploader = multer({
  storage: diskStorage,
  fileFilter: mimeFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/:ticketId", verifyToken, uploader.single("file"), async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { id: userId, company_id: companyId, role } = req.user;

    if (!req.file)
      return res.status(400).json({ success: false, message: "No file uploaded" });

    const fileUrl = `/uploads/${req.file.filename}`;

    const { rows } = await db.query(
      `INSERT INTO ticket_attachments (ticket_id, user_id, file_name, file_url, file_type, file_size)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [ticketId, userId, req.file.originalname, fileUrl, req.file.mimetype, req.file.size]
    );

    const uploaderRow  = await db.query("SELECT name FROM users WHERE user_id = $1", [userId]);
    const uploaderName = uploaderRow.rows[0]?.name ?? "Someone";
    const fileLabel    = req.file.mimetype.startsWith("image/") ? "image" : "file";

    const ticketRow    = await db.query(
      "SELECT user_id FROM support_tickets WHERE ticket_id = $1",
      [ticketId]
    );
    const ticketOwnerId = ticketRow.rows[0]?.user_id;

    const adminRoles = ["company_admin", "super_admin", "software_owner"];

    if (adminRoles.includes(role)) {
      if (ticketOwnerId && ticketOwnerId !== userId) {
        await createNotification(
          ticketOwnerId,
          "file_uploaded",
          `📎 ${uploaderName} uploaded a ${fileLabel}: "${req.file.originalname}"`,
          parseInt(ticketId)
        );
      }
    } else {
      const companyAdmins = await getCompanyAdmins(companyId);
      const superAdmins   = await getSuperAdmins();
      const uniqueAdmins  = [...new Set([...companyAdmins, ...superAdmins])];
      for (const adminId of uniqueAdmins) {
        await createNotification(
          adminId,
          "file_uploaded",
          `📎 ${uploaderName} uploaded a ${fileLabel}: "${req.file.originalname}"`,
          parseInt(ticketId)
        );
      }
    }

    return res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
});

router.get("/:ticketId", verifyToken, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { rows } = await db.query(
      `SELECT a.*, u.name AS uploader_name
       FROM ticket_attachments a
       LEFT JOIN users u ON a.user_id = u.user_id
       WHERE a.ticket_id = $1
       ORDER BY a.uploaded_at ASC`,
      [ticketId]
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Fetch attachments error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/file/:attachmentId", verifyToken, async (req, res) => {
  try {
    const { id: userId }      = req.user;
    const { attachmentId }    = req.params;

    const { rows } = await db.query(
      "SELECT * FROM ticket_attachments WHERE attachment_id = $1",
      [attachmentId]
    );

    if (!rows.length)
      return res.status(404).json({ success: false, message: "Attachment not found" });

    if (rows[0].user_id !== userId)
      return res.status(403).json({ success: false, message: "Not authorized" });

    const filePath = path.join(__dirname, "../..", rows[0].file_url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await db.query(
      "DELETE FROM ticket_attachments WHERE attachment_id = $1",
      [attachmentId]
    );

    return res.json({ success: true, message: "Attachment deleted" });
  } catch (err) {
    console.error("Delete attachment error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;