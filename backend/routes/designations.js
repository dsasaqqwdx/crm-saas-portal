const express = require("express");
const router = express.Router();
const pool = require("../config/db");
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM designations ORDER BY designation_id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch designations" });
  }
});
router.post("/", async (req, res) => {
  const { designation_name, company_id } = req.body;

  if (!designation_name || !company_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO designations (designation_name, company_id) VALUES ($1, $2) RETURNING *",
      [designation_name, company_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add designation" });
  }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "DELETE FROM designations WHERE designation_id = $1",
      [id]
    );
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete designation" });
  }
});

module.exports = router;