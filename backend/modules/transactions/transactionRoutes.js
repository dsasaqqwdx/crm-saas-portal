
const express     = require("express");
const router      = express.Router();
const pool        = require("../../config/db");
const auth        = require("../../middleware/authMiddleware");
const roleCheck   = require("../../middleware/roleCheck");

const isSuperAdmin = roleCheck(["super_admin", "software_owner"]);
const isAdmin      = roleCheck(["company_admin"]);

router.post("/", auth, isAdmin, async (req, res) => {
  try {
    const { company_id } = req.user;
    const { amount, payment_date, note, plan_name } = req.body;

    if (!amount || isNaN(amount))
      return res.status(400).json({ success: false, message: "Valid amount is required" });

    const result = await pool.query(
      `INSERT INTO transactions (company_id, amount, payment_date, status, note, plan_name)
       VALUES ($1, $2, $3, 'pending', $4, $5) RETURNING *`,
      [company_id, amount, payment_date || new Date(), note || null, plan_name || null]
    );

    return res.status(201).json({ success: true, data: result.rows[0], message: "Payment submitted for approval" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});
router.get("/my", auth, isAdmin, async (req, res) => {
  try {
    const { company_id } = req.user;
    const result = await pool.query(
      `SELECT t.*, c.company_name
       FROM transactions t
       LEFT JOIN companies c ON t.company_id = c.company_id
       WHERE t.company_id = $1
       ORDER BY t.payment_date DESC`,
      [company_id]
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/", auth, isSuperAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, c.company_name
       FROM transactions t
       LEFT JOIN companies c ON t.company_id = c.company_id
       ORDER BY t.payment_date DESC, t.transaction_id DESC`
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/stats", auth, isSuperAdmin, async (req, res) => {
  try {
    const total    = await pool.query("SELECT COUNT(*), COALESCE(SUM(amount),0) AS total_amount FROM transactions");
    const approved = await pool.query("SELECT COUNT(*), COALESCE(SUM(amount),0) AS total_amount FROM transactions WHERE status='approved'");
    const pending  = await pool.query("SELECT COUNT(*), COALESCE(SUM(amount),0) AS total_amount FROM transactions WHERE status='pending'");
    const rejected = await pool.query("SELECT COUNT(*) FROM transactions WHERE status='rejected'");

    return res.json({
      success: true,
      data: {
        total:          parseInt(total.rows[0].count),
        totalAmount:    parseFloat(total.rows[0].total_amount),
        approved:       parseInt(approved.rows[0].count),
        approvedAmount: parseFloat(approved.rows[0].total_amount),
        pending:        parseInt(pending.rows[0].count),
        pendingAmount:  parseFloat(pending.rows[0].total_amount),
        rejected:       parseInt(rejected.rows[0].count),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/approve/:id", auth, isSuperAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE transactions SET status='approved', reviewed_at=NOW() WHERE transaction_id=$1 RETURNING *",
      [req.params.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ success: false, message: "Transaction not found" });

    return res.json({ success: true, data: result.rows[0], message: "Transaction approved" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/reject/:id", auth, isSuperAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    const result = await pool.query(
      "UPDATE transactions SET status='rejected', reject_reason=$1, reviewed_at=NOW() WHERE transaction_id=$2 RETURNING *",
      [reason || null, req.params.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ success: false, message: "Transaction not found" });

    return res.json({ success: true, data: result.rows[0], message: "Transaction rejected" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/:id", auth, isSuperAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM transactions WHERE transaction_id=$1 RETURNING *",
      [req.params.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ success: false, message: "Transaction not found" });

    return res.json({ success: true, message: "Transaction deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
