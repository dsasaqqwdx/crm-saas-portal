const express = require("express");
const router = express.Router();
const pool = require("../../config/db");
const auth = require("../../middleware/authMiddleware");
const roleCheck = require("../../middleware/roleCheck");

const isSuperAdmin = roleCheck(["super_admin", "software_owner"]);

// GET all transactions (with company name)
router.get("/", auth, isSuperAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, c.company_name
      FROM transactions t
      LEFT JOIN companies c ON t.company_id = c.company_id
      ORDER BY t.payment_date DESC, t.transaction_id DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET transactions by company
router.get("/company/:company_id", auth, isSuperAdmin, async (req, res) => {
  try {
    const { company_id } = req.params;
    const result = await pool.query(`
      SELECT t.*, c.company_name
      FROM transactions t
      LEFT JOIN companies c ON t.company_id = c.company_id
      WHERE t.company_id = $1
      ORDER BY t.payment_date DESC
    `, [company_id]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET summary stats
router.get("/stats", auth, isSuperAdmin, async (req, res) => {
  try {
    const total = await pool.query("SELECT COUNT(*), COALESCE(SUM(amount), 0) as total_amount FROM transactions");
    const paid = await pool.query("SELECT COUNT(*), COALESCE(SUM(amount), 0) as total_amount FROM transactions WHERE LOWER(status) = 'paid'");
    const pending = await pool.query("SELECT COUNT(*), COALESCE(SUM(amount), 0) as total_amount FROM transactions WHERE LOWER(status) = 'pending'");
    const failed = await pool.query("SELECT COUNT(*) FROM transactions WHERE LOWER(status) = 'failed'");

    res.json({
      success: true,
      data: {
        total: parseInt(total.rows[0].count),
        totalAmount: parseFloat(total.rows[0].total_amount),
        paid: parseInt(paid.rows[0].count),
        paidAmount: parseFloat(paid.rows[0].total_amount),
        pending: parseInt(pending.rows[0].count),
        pendingAmount: parseFloat(pending.rows[0].total_amount),
        failed: parseInt(failed.rows[0].count),
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST create transaction
router.post("/", auth, isSuperAdmin, async (req, res) => {
  try {
    const { company_id, amount, payment_date, status } = req.body;
    if (!company_id) return res.status(400).json({ success: false, message: "Company is required" });
    if (!amount || isNaN(amount)) return res.status(400).json({ success: false, message: "Valid amount is required" });
    if (!status) return res.status(400).json({ success: false, message: "Status is required" });

    const result = await pool.query(
      "INSERT INTO transactions (company_id, amount, payment_date, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [company_id, amount, payment_date || new Date(), status]
    );
    res.status(201).json({ success: true, data: result.rows[0], message: "Transaction created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT update transaction status
router.put("/:id", auth, isSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, amount, payment_date } = req.body;

    const result = await pool.query(
      "UPDATE transactions SET status = COALESCE($1, status), amount = COALESCE($2, amount), payment_date = COALESCE($3, payment_date) WHERE transaction_id = $4 RETURNING *",
      [status, amount, payment_date, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: "Transaction not found" });

    res.json({ success: true, data: result.rows[0], message: "Transaction updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE transaction
router.delete("/:id", auth, isSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM transactions WHERE transaction_id = $1 RETURNING *", [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: "Transaction not found" });
    res.json({ success: true, message: "Transaction deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;