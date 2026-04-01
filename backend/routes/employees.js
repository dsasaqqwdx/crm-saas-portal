const express = require('express');
const router = express.Router();
const pool = require("../config/db");
router.get('/company/:company_id', async (req, res) => {
  const { company_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
         e.employee_id,
         e.name,
         e.email,
         e.phone,
         e.joining_date,
         d.department_name,
         des.designation_name
       FROM employees e
       LEFT JOIN departments d ON d.department_id = e.department_id
       LEFT JOIN designations des ON des.designation_id = e.designation_id
       WHERE e.company_id = $1
       ORDER BY e.employee_id ASC`,
      [company_id]
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});
router.get('/:employee_id', async (req, res) => {
  const { employee_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
         e.employee_id,
         e.name,
         e.email,
         e.phone,
         e.joining_date,
         e.company_id,
         d.department_name,
         des.designation_name
       FROM employees e
       LEFT JOIN departments d ON d.department_id = e.department_id
       LEFT JOIN designations des ON des.designation_id = e.designation_id
       WHERE e.employee_id = $1`,
      [employee_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});
router.post('/', async (req, res) => {
  const { name, email, phone, department_id, designation_id, company_id, joining_date } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO employees (name, email, phone, department_id, designation_id, company_id, joining_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, email, phone, department_id, designation_id, company_id, joining_date]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});
router.put('/:employee_id', async (req, res) => {
  const { employee_id } = req.params;
  const { name, email, phone, department_id, designation_id, joining_date } = req.body;
  try {
    const result = await pool.query(
      `UPDATE employees
       SET name = $1, email = $2, phone = $3,
           department_id = $4, designation_id = $5, joining_date = $6
       WHERE employee_id = $7 RETURNING *`,
      [name, email, phone, department_id, designation_id, joining_date, employee_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:employee_id', async (req, res) => {
  const { employee_id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM employees WHERE employee_id = $1 RETURNING *`,
      [employee_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    res.status(200).json({ success: true, message: 'Employee deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;