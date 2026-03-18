const db = require("../../config/db");

exports.getPlans = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM plans ORDER BY plan_id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPlan = async (req, res) => {
  const { plan_name, price, billing_cycle, max_employees, features } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO plans (plan_name, price, billing_cycle, max_employees, features)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [plan_name, price, billing_cycle, max_employees, features]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    await db.query("DELETE FROM plans WHERE plan_id = $1", [req.params.id]);
    res.json({ message: "Plan deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};