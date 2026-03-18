const express = require('express');
const router = express.Router();
const { markAttendance } = require('./attendanceController');
const protect = require('../../middleware/authMiddleware');
const pool = require('../../config/db');


router.post('/mark', protect, markAttendance);

router.get('/today', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT a.status, a.check_in, a.check_out
      FROM public.attendance a
      JOIN public.employees e ON a.employee_id = e.employee_id
      JOIN public.users u ON LOWER(u.email) = LOWER(e.email)
      WHERE u.user_id = $1
      AND a.attendance_date = CURRENT_DATE
    `, [userId]);

    if (result.rows.length === 0) {
      return res.json({ marked: false });
    }

    res.json({
      marked: true,
      data: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.get('/all', protect, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.name, 
        a.attendance_date AS date, 
        a.status, 
        a.check_in, 
        a.check_out
      FROM public.attendance a
      JOIN public.employees e ON a.employee_id = e.employee_id
      ORDER BY a.attendance_date DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;