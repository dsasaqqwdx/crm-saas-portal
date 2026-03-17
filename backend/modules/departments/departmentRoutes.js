const express = require("express");
const router = express.Router();
const pool = require("../../config/db");
const verifyToken = require("../../middleware/authMiddleware");
const checkRole = require("../../middleware/roleCheck");

// GET all departments for the company
router.get("/", verifyToken, async (req, res) => {
  try {
    const { company_id } = req.user;
    const result = await pool.query(
      "SELECT * FROM departments WHERE company_id = $1 ORDER BY department_name ASC",
      [company_id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET single department
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { company_id } = req.user;
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM departments WHERE department_id = $1 AND company_id = $2",
      [id, company_id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: "Department not found" });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST create department (Admin only)
router.post("/", verifyToken, checkRole(["company_admin"]), async (req, res) => {
  try {
    const { company_id } = req.user;
    const { department_name } = req.body;

    if (!department_name || department_name.trim() === "")
      return res.status(400).json({ success: false, message: "Department name is required" });

    // Check for duplicate
    const exists = await pool.query(
      "SELECT 1 FROM departments WHERE LOWER(department_name) = LOWER($1) AND company_id = $2",
      [department_name.trim(), company_id]
    );
    if (exists.rows.length > 0)
      return res.status(409).json({ success: false, message: "Department already exists" });

    const result = await pool.query(
      "INSERT INTO departments (department_name, company_id) VALUES ($1, $2) RETURNING *",
      [department_name.trim(), company_id]
    );
    res.status(201).json({ success: true, data: result.rows[0], message: "Department created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT update department (Admin only)
router.put("/:id", verifyToken, checkRole(["company_admin"]), async (req, res) => {
  try {
    const { company_id } = req.user;
    const { id } = req.params;
    const { department_name } = req.body;

    if (!department_name || department_name.trim() === "")
      return res.status(400).json({ success: false, message: "Department name is required" });

    // Check for duplicate (exclude current)
    const exists = await pool.query(
      "SELECT 1 FROM departments WHERE LOWER(department_name) = LOWER($1) AND company_id = $2 AND department_id != $3",
      [department_name.trim(), company_id, id]
    );
    if (exists.rows.length > 0)
      return res.status(409).json({ success: false, message: "Department name already exists" });

    const result = await pool.query(
      "UPDATE departments SET department_name = $1 WHERE department_id = $2 AND company_id = $3 RETURNING *",
      [department_name.trim(), id, company_id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: "Department not found" });

    res.json({ success: true, data: result.rows[0], message: "Department updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE department (Admin only)
router.delete("/:id", verifyToken, checkRole(["company_admin"]), async (req, res) => {
  try {
    const { company_id } = req.user;
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM departments WHERE department_id = $1 AND company_id = $2 RETURNING *",
      [id, company_id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: "Department not found" });

    res.json({ success: true, message: "Department deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;